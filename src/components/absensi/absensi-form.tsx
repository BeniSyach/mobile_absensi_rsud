/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */

import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
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
import {
  imageUriToSpoofTensor,
  imageUriToTensor,
} from '@/utils/face-utils-lite';
import { EMB_INPUT_SIZE } from '@/utils/model-loader-lite';

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
const SIMILARITY_THRESHOLD = 0.7; // Increased for better security
const SPOOF_INPUT_SIZE = 256;
const SPOOF_THRESHOLD = 0.2;
// ===== Types =====
interface VerificationResult {
  success: boolean;
  similarity: number;
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
        <Text className="text-gray-500">Memeriksa Izin Kamera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="mt-2 items-center">
        <Text className="mb-2 text-gray-400">
          Izin Kamera Tidak Diberikan, Tolong Izinkan Kamera Untuk Mengakses
          Aplikasi ini.
        </Text>
        <Button label="Grant Camera Access" onPress={requestPermission} />
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera tidak siap (ref null)');
      return;
    }
    if (isCapturing) {
      Alert.alert('Info', 'Sedang memproses verifikasi, tunggu sebentar');
      return;
    }
    if (!cameraReady) {
      Alert.alert('Info', 'Camera belum siap, tunggu sebentar');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true, // Don't need base64 for verification
        skipProcessing: true,
        quality: 0.5,
      });

      if (!photo?.uri) {
        throw new Error('Gagal Mengambil Foto Kamera');
      }

      await onTakePhoto({
        uri: photo.uri,
        base64: photo.base64 ?? '', // Not needed
      });
    } catch (error) {
      console.error('Gagal Mengambil Foto Kamera:', error);
      Alert.alert('Error', 'Gagal Mengambil Foto Kamera, Silahkan Coba Lagi.');
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
        {/* Overlay Face Box */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-[70%] w-1/2 rounded-full border-4 border-green-500 bg-transparent" />
        </View>

        {/* Capture button */}
        <View className="h-96 w-full flex-1 items-end justify-end bg-transparent px-4 pb-4">
          <Button
            label={isCapturing ? 'Proses Verifikasi' : 'Verifikasi Wajah'}
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

export const FaceVerifyScreen: React.FC<FaceVerifyScreenProps> = ({
  showCamera,
  onVerificationComplete,
  handleTakePhoto,
}) => {
  const [savedEmbedding, setSavedEmbedding] =
    React.useState<Float32Array | null>(null);
  const [verifiedPhotoUri, setVerifiedPhotoUri] = React.useState<string | null>(
    null
  );
  const [status, setStatus] = React.useState('Checking models...');
  const [attempts, setAttempts] = React.useState(0);
  const [isVerifying, setIsVerifying] = React.useState(false);

  const spoofModel = useTensorflowModel(
    require('../../../assets/model/FaceAntiSpoofing.tflite')
  );

  const embedModel = useTensorflowModel(
    require('../../../assets/model/mobilefacenet.tflite')
  );

  // Load stored embedding once
  React.useEffect(() => {
    const loadEmbedding = async () => {
      const stored = getStoredEmbedding();
      if (!stored) {
        Alert.alert('Error', 'Belum ada wajah yang terdaftar');
      } else {
        setSavedEmbedding(stored);
      }
    };
    loadEmbedding();
  }, []);

  // Update status based on model state
  React.useEffect(() => {
    if (embedModel.state === 'loaded') {
      setStatus('Face Recoginiton Siap, Kamera Siap Mengambil Wajah');
    } else if (embedModel.state === 'loading') {
      setStatus('Loading Face Recoginiton...');
    } else if (embedModel.state === 'error') {
      setStatus('Error Data Face Recognition');
      Alert.alert('Error', 'Gagal Mengambil Data Face Recognition');
    }
  }, [embedModel.state]);

  async function runSpoofCheck(uri: string): Promise<'Real' | 'Spoof'> {
    if (!spoofModel.model || spoofModel.state !== 'loaded') {
      console.warn('⚠️ Spoof model not loaded');
      return 'Real'; // fallback biar app tetap jalan
    }

    try {
      // 🔹 Normalisasi gambar jadi Float32Array
      const input = await imageUriToSpoofTensor(uri, SPOOF_INPUT_SIZE);

      // ✅ Validasi ukuran input
      const expectedSize = SPOOF_INPUT_SIZE * SPOOF_INPUT_SIZE * 3;
      if (input.length !== expectedSize) {
        console.error(
          `❌ Input size mismatch. Expected: ${expectedSize}, Got: ${input.length}`
        );
        return 'Real';
      }

      // 🔹 Bentuk input sesuai model: [1, 256, 256, 3]
      const reshaped = new Float32Array(1 * expectedSize);
      reshaped.set(input);

      // 🔹 Jalankan model
      const outputs = spoofModel.model.runSync([reshaped]);

      if (!outputs || outputs.length === 0) {
        console.error('❌ Spoof model returned empty output:', outputs);
        return 'Real';
      }

      let spoofScore = 0;

      if (outputs.length >= 2) {
        // 🔹 Case: model punya 2 output → [classification_pred, leaf_node_mask]
        const clssPred = Float32Array.from(outputs[0] as Float32Array);
        const leafNodeMask = Float32Array.from(outputs[1] as Float32Array);

        if (clssPred.length !== leafNodeMask.length) {
          console.warn(
            '⚠️ Output length mismatch:',
            clssPred.length,
            'vs',
            leafNodeMask.length
          );
          // Fallback ke output pertama saja
          spoofScore = clssPred.length > 0 ? clssPred[0] : 0;
        } else {
          // ✅ Weighted sum approach (typical untuk ensemble models)
          let weightedSum = 0;
          let totalWeight = 0;

          for (let i = 0; i < clssPred.length; i++) {
            const pred = clssPred[i];
            const weight = leafNodeMask[i];

            if (!isNaN(pred) && !isNaN(weight) && weight > 0) {
              weightedSum += pred * weight;
              totalWeight += weight;
            }
          }

          spoofScore =
            totalWeight > 0 ? weightedSum / totalWeight : clssPred[0] || 0;
        }
      } else {
        // 🔹 Case: model cuma punya 1 output
        const output = Float32Array.from(outputs[0] as Float32Array);

        if (output.length === 1) {
          // Single value prediction (common case)
          spoofScore = output[0];
        } else if (output.length === 2) {
          // Binary classification [real_prob, spoof_prob]
          spoofScore = output[1]; // spoof probability
        } else if (output.length > 2) {
          // Multi-class atau feature vector - ambil yang pertama
          console.warn(
            '⚠️ Unexpected output length:',
            output.length,
            'using first value'
          );
          spoofScore = output[0];
        } else {
          console.error('❌ Empty output array');
          return 'Real';
        }
      }

      // ✅ Handle edge cases
      if (isNaN(spoofScore)) {
        console.error('❌ Spoof score is NaN, defaulting to Real');
        return 'Real';
      }

      const result = spoofScore > SPOOF_THRESHOLD ? 'Spoof' : 'Real';

      return result;
    } catch (err) {
      console.error('❌ runSpoofCheck error:', err);
      return 'Real'; // fallback aman
    }
  }

  const onVerifyPhoto = React.useCallback(
    async (photo: { uri: string }) => {
      if (!embedModel || embedModel.state !== 'loaded') {
        Alert.alert('Error', 'Model Face Recognition belum siap');
        return;
      }

      if (!savedEmbedding) {
        Alert.alert('Error', 'Belum ada wajah yang terdaftar');
        return;
      }

      setIsVerifying(true);
      let croppedUri: string | null = null;

      // ✅ Update attempts di awal untuk menghindari race condition
      const currentAttempt = attempts + 1;
      setAttempts(currentAttempt);

      try {
        // 🔹 Face Detection
        const detection = await FaceDetector.detectFacesAsync(photo.uri, {
          mode: FaceDetector.FaceDetectorMode.accurate,
        });

        if (!detection.faces.length) {
          throw new Error('Wajah tidak terdeteksi dalam foto');
        }

        // ✅ Handle multiple faces
        if (detection.faces.length > 1) {
          console.warn('⚠️ Multiple faces detected, using largest face');
          // Pilih wajah terbesar
          const faces = detection.faces.sort(
            (a, b) =>
              b.bounds.size.width * b.bounds.size.height -
              a.bounds.size.width * a.bounds.size.height
          );
          var face = faces[0];
        } else {
          var face = detection.faces[0];
        }

        const box = face.bounds;

        // ✅ Validate face size
        if (box.size.width < 50 || box.size.height < 50) {
          throw new Error('Wajah terlalu kecil, dekatkan ke kamera');
        }

        // 🔹 Crop face
        const cropped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: Math.max(0, box.origin.x),
                originY: Math.max(0, box.origin.y),
                width: box.size.width,
                height: box.size.height,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        croppedUri = cropped.uri;

        // ✅ Anti-Spoofing Check (PENTING untuk verifikasi!)
        const spoofResult = await runSpoofCheck(cropped.uri);
        if (spoofResult === 'Spoof') {
          throw new Error(
            'Terdeteksi menggunakan foto/video. Gunakan wajah asli!'
          );
        }

        // 🔹 Generate embedding
        const embeddingTensor = await imageUriToTensor(
          cropped.uri,
          EMB_INPUT_SIZE,
          'neg_one_pos_one'
        );

        const embeddingOutput = embedModel.model.runSync([embeddingTensor]);
        if (!embeddingOutput || !embeddingOutput[0]) {
          throw new Error('Gagal membuat face embedding');
        }

        const currentEmbedding = embeddingOutput[0] as Float32Array;

        // 🔹 Calculate similarity
        const similarity = cosineSimilarity(currentEmbedding, savedEmbedding);
        const success = similarity >= SIMILARITY_THRESHOLD;

        // ✅ Update state based on result
        if (success) {
          setVerifiedPhotoUri(photo.uri);

          // Handle success callback
          if (handleTakePhoto) {
            await handleTakePhoto(photo);
          }

          Alert.alert(
            '✅ Verifikasi Berhasil',
            `Wajah cocok dengan tingkat kemiripan ${(similarity * 100).toFixed(1)}%`
          );
        } else {
          setVerifiedPhotoUri(null);

          Alert.alert(
            '❌ Verifikasi Gagal',
            `Wajah tidak cocok. Kemiripan hanya ${(similarity * 100).toFixed(1)}%\n\nSilakan coba lagi atau daftar ulang wajah Anda.`
          );
        }

        // ✅ Callback dengan attempt number yang konsisten
        onVerificationComplete({
          success,
          similarity,
          attempts: currentAttempt,
        });
      } catch (err: any) {
        console.error('❌ Verification error:', err);

        // ✅ Consistent error handling
        onVerificationComplete({
          success: false,
          similarity: 0,
          attempts: currentAttempt,
        });

        const errorMessage = err.message || 'Verifikasi gagal';
        Alert.alert('❌ Error Verifikasi', errorMessage);
      } finally {
        // ✅ Cleanup cropped image
        if (croppedUri && croppedUri !== photo.uri) {
          try {
            await FileSystem.deleteAsync(croppedUri, { idempotent: true });
          } catch (cleanupError) {
            console.warn('⚠️ Failed to cleanup cropped image:', cleanupError);
          }
        }

        setIsVerifying(false);
      }
    },
    [
      embedModel,
      savedEmbedding,
      onVerificationComplete,
      handleTakePhoto,
      attempts,
    ]
  );

  return (
    <View className="flex-1">
      {/* Loading overlay */}
      {isVerifying && (
        <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-black/40">
          <ActivityIndicator size="large" color="#00FF00" />
          <Text className="mt-2 text-lg text-white">
            Memverifikasi Wajah...
          </Text>
        </View>
      )}

      {/* Tampilkan status */}
      <View className="p-4">
        <Text className="text-gray-400">{status}</Text>
      </View>

      {/* Tampilkan foto yang berhasil diverifikasi */}
      {verifiedPhotoUri && (
        <View className="items-center justify-center p-4">
          <Text className="mb-2 text-lg font-bold text-green-600">
            ✅ Foto berhasil Di Verifikasi
          </Text>
        </View>
      )}

      {/* Camera section */}
      <CameraSectionVerify
        showCamera={showCamera}
        onTakePhoto={onVerifyPhoto}
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
      {hasError && <Text className="text-red-500">Foto tidak tersedia</Text>}
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
    };

    const handleVerificationComplete = (result: VerificationResult) => {
      setVerificationResult(result);

      if (result.success) {
        Alert.alert(
          'Berhasil',
          `Wajah berhasil Di Verifikasi! Skor Wajah: ${(result.similarity * 100).toFixed(1)}%`
        );
        setShowCamera(false);
      } else {
        Alert.alert(
          'Gagal',
          `Wajah Gagal Di Verifikasi. Skor Wajah: ${(
            result.similarity * 100
          ).toFixed(1)}%`
        );
      }
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
        className="mx-24 rounded-full bg-[#20A0D8]"
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
