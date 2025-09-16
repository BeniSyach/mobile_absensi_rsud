/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
import '@tensorflow/tfjs-react-native';

import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, CameraIcon, Save } from 'lucide-react-native';
import * as React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { ActivityIndicator, Alert } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { MMKV } from 'react-native-mmkv';

import { type ApiResponse } from '@/api';
import { type LastAbsenStatus } from '@/api/absensi/cek-status-absen-user';
import Maps from '@/components/absensi/maps';
import {
  Button,
  Image,
  type OptionType,
  ScrollView,
  Select,
  Text,
  View,
} from '@/components/ui';
import { imageUriToTensor } from '@/utils/face-utils-lite';
import { DET_INPUT_SIZE, EMB_INPUT_SIZE } from '@/utils/model-loader-lite';

import { type FormType } from './absensi-types';
import { useAbsensiForm } from './use-absensi-form';

interface FormFieldsProps {
  tipe_absensi_value: string | number | undefined;
  shift_value: string | number | undefined;
  hari_kerja_value: string | number | undefined;
  tipe_shift: OptionType[];
  tipe_hari_kerja: OptionType[];
  onTipeAbsensiSelect: (value: string | number) => void;
  onShiftSelect: (value: string | number) => void;
  onHariKerjaSelect: (value: string | number) => void;
  onImageSelect: (photo: { uri: string; base64: string }) => void;
  image: { uri: string } | null;
  errors: any;
  isTipeAbsensiDisabled: boolean;
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
}

export type AbsensiFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<FormType>;
  user: ApiResponse;
  userStatus: LastAbsenStatus | undefined;
};

const tipe_absensi: OptionType[] = [
  { value: '0', label: 'Masuk' },
  { value: '1', label: 'Pulang' },
];

// MMKV storage
// ===== Storage Configuration =====
const storage = new MMKV({
  id: 'face-auth',
});

const FACE_EMBED_KEY = 'face_embedding';

// ===== Constants =====
const SIMILARITY_THRESHOLD = 0.6; // Increased for better security

// ===== Types =====
interface VerificationResult {
  success: boolean;
  similarity: number;
  confidence: number;
  attempts: number;
}

const getStoredEmbedding = (): Float32Array | null => {
  try {
    const savedStr = storage.getString(FACE_EMBED_KEY);
    if (!savedStr) return null;

    const parsed = JSON.parse(savedStr);
    return new Float32Array(parsed);
  } catch (error) {
    console.error('Failed to load stored embedding:', error);
    return null;
  }
};

// ===== Camera Component =====
interface CameraSectionProps {
  showCamera: boolean;
  onTakePhoto: (photo: { uri: string; base64: string }) => Promise<void>;
  isCapturing: boolean;
}

const CameraSectionVerify: React.FC<CameraSectionProps> = ({
  showCamera,
  onTakePhoto,
  isCapturing,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = React.useState<CameraType>('front');
  const [cameraReady, setCameraReady] = React.useState(false);
  const cameraRef = React.useRef<CameraView>(null);

  if (!showCamera) return null;
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="mt-2 items-center">
        <Text className="mb-2 text-gray-400">
          Camera access is required for face verification
        </Text>
        <Button label="Grant Camera Access" onPress={requestPermission} />
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing || !cameraReady) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true, // Don't need base64 for verification
        quality: 0.3, // Higher quality for better accuracy
        skipProcessing: false,
        exif: false,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture photo');
      }

      await onTakePhoto({
        uri: photo.uri,
        base64: photo.base64 ?? '', // Not needed
      });
    } catch (error) {
      console.error('Failed to take photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        onCameraReady={() => setCameraReady(true)}
      >
        <View className="h-96 w-full flex-1 items-end justify-end bg-transparent px-4 pb-4">
          <Button
            label={isCapturing ? 'Processing...' : 'Verify Face'}
            onPress={handleTakePhoto}
            disabled={isCapturing || !cameraReady}
            icon={!isCapturing && <Camera size={20} color="white" />}
          />
        </View>
      </CameraView>
    </View>
  );
};

// ===== Main Verification Component =====
interface FaceVerifyScreenProps {
  showCamera: boolean;
  onVerificationComplete: (result: VerificationResult) => void;
  onCancel?: () => void;
  handleTakePhoto?: (photo: { uri: string; base64?: string }) => Promise<void>; // optional
}

// ===== Utils =====
const cosineSimilarity = (a: Float32Array, b: Float32Array) => {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const FaceVerifyScreen: React.FC<FaceVerifyScreenProps> = ({
  showCamera,
  onVerificationComplete,
  handleTakePhoto,
}) => {
  const [blazefaceModel, setBlazefaceModel] = React.useState<any>(null);
  const [mobileFaceNet, setMobileFaceNet] = React.useState<any>(null);
  const [savedEmbedding, setSavedEmbedding] =
    React.useState<Float32Array | null>(null);
  const [verifiedPhotoUri, setVerifiedPhotoUri] = React.useState<string | null>(
    null
  );
  const [attempts, setAttempts] = React.useState(0);
  const [isVerifying, setIsVerifying] = React.useState(false);

  // Load TensorFlow models
  const detectionModel = useTensorflowModel(
    require('../../../assets/model/blazeface.tflite')
  );
  const embedModel = useTensorflowModel(
    require('../../../assets/model/mobilefacenet.tflite')
  );

  React.useEffect(() => {
    const init = async () => {
      try {
        while (
          detectionModel.state !== 'loaded' ||
          embedModel.state !== 'loaded'
        ) {
          await new Promise((r) => setTimeout(r, 100));
        }
        setBlazefaceModel(detectionModel);
        setMobileFaceNet(embedModel);

        const stored = await getStoredEmbedding();
        if (!stored) Alert.alert('Error', 'Belum ada wajah yang terdaftar');
        else setSavedEmbedding(stored);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Gagal load AI models');
      }
    };
    init();
  }, []);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  // Deteksi wajah sederhana menggunakan BlazeFace
  const detectFaces = React.useCallback(
    async (photoUri: string) => {
      if (!blazefaceModel) return [];
      // Resize ke 128x128 untuk BlazeFace
      const pixels = await imageUriToTensor(
        photoUri,
        DET_INPUT_SIZE,
        'zero_one'
      );

      const outputs = blazefaceModel.model.runSync([pixels]);
      if (!outputs || !outputs[0]) return [];
      const detections = outputs[0] as Float32Array;

      // Ambil prediksi dengan score tinggi
      const results: any[] = [];
      const stride = 16;
      for (let i = 0; i < detections.length; i += stride) {
        const score = sigmoid(detections[i + 15]);
        if (score < 0.8) continue;
        results.push({
          score,
          box: {
            x: detections[i],
            y: detections[i + 1],
            w: detections[i + 2],
            h: detections[i + 3],
          },
        });
      }
      return results.sort((a, b) => b.score - a.score);
    },
    [blazefaceModel]
  );

  // Verifikasi foto
  const onVerifyPhoto = React.useCallback(
    async (photo: { uri: string }) => {
      if (!blazefaceModel || !mobileFaceNet || !savedEmbedding) return;

      setIsVerifying(true);

      try {
        const faces = await detectFaces(photo.uri);
        if (faces.length === 0) throw new Error('Wajah tidak terdeteksi');

        const embeddingTensor = await imageUriToTensor(
          photo.uri,
          EMB_INPUT_SIZE,
          'neg_one_pos_one'
        );

        const embeddingOutput = mobileFaceNet.model.runSync([embeddingTensor]);
        const currentEmbedding = embeddingOutput[0] as Float32Array;

        const similarity = cosineSimilarity(currentEmbedding, savedEmbedding);
        const success = similarity >= SIMILARITY_THRESHOLD;

        // Increment attempts safely
        setAttempts((prev) => prev + 1);

        if (success) {
          setVerifiedPhotoUri(photo.uri);

          if (handleTakePhoto) {
            await handleTakePhoto(photo);
          }

          Alert.alert(
            'Sukses',
            `Wajah cocok (${(similarity * 100).toFixed(1)}%)`
          );
        } else {
          Alert.alert(
            'Gagal',
            `Wajah tidak cocok (${(similarity * 100).toFixed(1)}%)`
          );
        }

        // callback ke parent
        onVerificationComplete({
          success,
          similarity,
          confidence: faces[0].score,
          attempts: attempts + 1, // atau bisa di-update setelah setAttempts prev+1
        });
      } catch (err: any) {
        setAttempts((prev) => prev + 1);
        onVerificationComplete({
          success: false,
          similarity: 0,
          confidence: 0,
          attempts: attempts + 1,
        });
        Alert.alert('Error', err.message || 'Verifikasi gagal');
      } finally {
        setIsVerifying(false);
      }
    },
    [
      blazefaceModel,
      mobileFaceNet,
      savedEmbedding,
      detectFaces,
      onVerificationComplete,
      handleTakePhoto,
    ]
  );

  const internalHandleTakePhoto = React.useCallback(
    async (photo: { uri: string; base64?: string }) => {
      if (!photo) return;

      // langsung panggil verifikasi
      await onVerifyPhoto(photo);
    },
    [onVerifyPhoto]
  );

  return (
    <View className="flex-1">
      {/* Loading overlay */}
      {isVerifying && (
        <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-black/40">
          <ActivityIndicator size="large" color="#00FF00" />
          <Text className="mt-2 text-lg text-white">Verifying face...</Text>
        </View>
      )}

      {/* Tampilkan foto yang berhasil diverifikasi */}
      {verifiedPhotoUri && (
        <View className="items-center justify-center p-4">
          <Text className="mb-2 text-lg font-bold text-green-600">
            ✅ Verified Photo
          </Text>
        </View>
      )}

      {/* Camera section */}
      <CameraSectionVerify
        showCamera={showCamera}
        onTakePhoto={internalHandleTakePhoto}
        isCapturing={isVerifying}
      />
    </View>
  );
};

// ImagePreview component
const ImagePreview = React.memo<{
  image: { uri: string } | null;
  showCamera: boolean;
  errors: any;
}>(({ image, showCamera, errors }) => {
  const [hasError, setHasError] = React.useState(false);
  if (!image || showCamera) {
    return errors.photo ? (
      <View className="mb-2">
        <Text className="text-red-500">{errors.photo?.message}</Text>
      </View>
    ) : null;
  }

  return (
    <View className="mt-2 items-center">
      {!hasError && (
        <Image
          source={{ uri: image.uri }}
          className="h-44 w-full"
          style={{ width: 300, height: 300 }}
          contentFit="cover"
          onError={(error) => {
            console.log('Image error:', error);
            setHasError(true);
          }}
        />
      )}
      {hasError && <Text className="text-red-500">Gagal memuat gambar</Text>}
    </View>
  );
});

ImagePreview.displayName = 'ImagePreview';

const SelectFields = React.memo<{
  tipe_absensi_value: string | number | undefined;
  shift_value: string | number | undefined;
  hari_kerja_value: string | number | undefined;
  shiftOptions: OptionType[];
  hariKerjaOptions: OptionType[];
  onTipeAbsensiSelect: (value: string | number) => void;
  onShiftSelect: (value: string | number) => void;
  onHariKerjaSelect: (value: string | number) => void;
  errors: any;
}>(
  ({
    tipe_absensi_value,
    shift_value,
    hari_kerja_value,
    shiftOptions,
    hariKerjaOptions,
    onTipeAbsensiSelect,
    onShiftSelect,
    onHariKerjaSelect,
    errors,
  }) => (
    <View className="space-y-4">
      {/* Baris pertama: dua kolom */}
      <View className="flex-row">
        <View className="mr-4" style={{ flex: 1 }}>
          <Select
            label="Tipe Absensi"
            options={tipe_absensi}
            value={tipe_absensi_value}
            onSelect={onTipeAbsensiSelect}
            placeholder="Pilih Tipe Absensi"
            error={errors.tipe_absensi?.message}
            disabled={true}
            size="lg"
            bg={
              tipe_absensi_value === '0'
                ? 'success' // hijau
                : tipe_absensi_value === '1'
                  ? 'danger' // merah
                  : 'primary' // default
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          <Select
            label="Tipe Shift"
            options={shiftOptions}
            value={shift_value}
            onSelect={onShiftSelect}
            placeholder="Pilih Tipe Shift"
            error={errors.shift_id?.message}
            disabled={true}
            size="lg"
            bg="primary"
          />
        </View>
      </View>

      {/* Baris kedua: full width */}
      <View>
        <Select
          label="Shift / Hari Kerja"
          options={hariKerjaOptions}
          value={hari_kerja_value}
          onSelect={onHariKerjaSelect}
          placeholder="Pilih Hari Kerja"
          error={errors.waktu_kerja_id?.message}
        />
      </View>
    </View>
  )
);
SelectFields.displayName = 'SelectFields';

const FormFields = React.memo<FormFieldsProps>(
  ({
    tipe_absensi_value,
    shift_value,
    hari_kerja_value,
    tipe_shift,
    tipe_hari_kerja,
    onTipeAbsensiSelect,
    onShiftSelect,
    onHariKerjaSelect,
    image,
    errors,
    showCamera,
    setShowCamera,
    onImageSelect,
  }) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const [verificationResult, setVerificationResult] =
      React.useState<VerificationResult | null>(null);

    const handleTakePhoto = async (photo: { uri: string; base64?: string }) => {
      onImageSelect({
        uri: photo.uri,
        base64: photo.base64 ?? '', // selalu kirim string
      });
      setShowCamera(false);
    };

    const handleVerificationComplete = (result: VerificationResult) => {
      setVerificationResult(result);

      if (result.success) {
        Alert.alert(
          'Success',
          `Face verified! Similarity: ${(result.similarity * 100).toFixed(1)}%`
        );
      } else {
        Alert.alert(
          'Failed',
          `Verification failed. Similarity: ${(result.similarity * 100).toFixed(
            1
          )}%`
        );
      }
      setShowCamera(false); // Close camera after verification
    };

    return (
      <>
        <SelectFields
          tipe_absensi_value={tipe_absensi_value}
          shift_value={shift_value}
          hari_kerja_value={hari_kerja_value}
          shiftOptions={tipe_shift}
          hariKerjaOptions={tipe_hari_kerja}
          onTipeAbsensiSelect={onTipeAbsensiSelect}
          onShiftSelect={onShiftSelect}
          onHariKerjaSelect={onHariKerjaSelect}
          errors={errors}
        />
        <Button
          label={showCamera ? 'Tutup Kamera' : 'Ambil Foto Absensi'}
          onPress={() => setShowCamera(!showCamera)}
          className="mx-10 rounded-full bg-[#20A0D8]"
          size="default"
          icon={<CameraIcon size={20} color={'white'} />}
          variant="outline"
        />

        <FaceVerifyScreen
          showCamera={showCamera}
          handleTakePhoto={handleTakePhoto} // Parent handler optional
          onVerificationComplete={handleVerificationComplete}
          onCancel={() => setShowCamera(false)}
        />
        <ImagePreview image={image} showCamera={showCamera} errors={errors} />
      </>
    );
  }
);
FormFields.displayName = 'FormFields';

const FormContainer = React.memo<{
  children: React.ReactNode;
  onSubmit: () => void;
  isPending: boolean;
}>(({ children, onSubmit, isPending }) => (
  <ScrollView className="flex-1 p-2">
    <View className="p-4">
      {children}
      <Button
        label="Absen"
        variant="outline"
        loading={isPending}
        onPress={onSubmit}
        className="mx-32 rounded-full bg-[#20A0D8]"
        size="lg"
        icon={<Save size={20} color={'white'} />}
      />
    </View>
  </ScrollView>
));
FormContainer.displayName = 'FormContainer';

export const AbsensiForm = React.memo<AbsensiFormProps>(
  ({ isPending, onSubmit, user, userStatus }) => {
    const { handleSubmit, handleLocationUpdate, formFieldProps } =
      useAbsensiForm(user, userStatus);
    return (
      <FormContainer onSubmit={handleSubmit(onSubmit)} isPending={isPending}>
        <Maps
          selectedLatitude={parseFloat(user.data.latitude_unit_kerja)}
          selectedLongitude={parseFloat(user.data.longitude_unit_kerja)}
          radius={Number(user?.data?.radius_unit_kerja ?? 0)}
          onLocationUpdate={handleLocationUpdate}
        />
        <FormFields {...formFieldProps} />
      </FormContainer>
    );
  }
);
