/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
import '@tensorflow/tfjs-react-native';

import type * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, CameraIcon, Save } from 'lucide-react-native';
import * as React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { ActivityIndicator, Alert, BackHandler, Vibration } from 'react-native';
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
import { getFaceEmbedding } from '@/utils/face-utils';
import { loadModels } from '@/utils/model-loader';

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
const VERIFICATION_ATTEMPTS_KEY = 'verification_attempts';
const LAST_VERIFICATION_KEY = 'last_verification_time';

// ===== Constants =====
const SIMILARITY_THRESHOLD = 0.7; // Increased for better security
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_COOLDOWN = 30000; // 30 seconds
// const FACE_CONFIDENCE_THRESHOLD = 0.8;
// const VERIFICATION_TIMEOUT = 30000; // 15 seconds

// ===== Types =====
interface VerificationResult {
  success: boolean;
  similarity: number;
  confidence: number;
  attempts: number;
}

interface VerificationState {
  status: 'idle' | 'loading' | 'processing' | 'success' | 'fail' | 'blocked';
  loading: boolean;
  error: string | null;
  attempts: number;
  cooldownUntil: number | null;
  lastResult: VerificationResult | null;
}

// ===== Utility Functions =====
const cosineSimilarity = (a: Float32Array, b: Float32Array): number => {
  if (!a || !b || a.length !== b.length || a.length === 0) {
    throw new Error('Invalid embeddings for similarity calculation');
  }

  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);

  if (denominator === 0) {
    console.warn('Zero norm detected in embeddings');
    return 0;
  }

  return Math.max(0, Math.min(1, dot / denominator)); // Clamp to [0, 1]
};

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

const getVerificationAttempts = (): number => {
  return storage.getNumber(VERIFICATION_ATTEMPTS_KEY) || 0;
};

const incrementVerificationAttempts = (): number => {
  const current = getVerificationAttempts() + 1;
  storage.set(VERIFICATION_ATTEMPTS_KEY, current);
  return current;
};

const resetVerificationAttempts = (): void => {
  storage.delete(VERIFICATION_ATTEMPTS_KEY);
};

const isInCooldown = (): boolean => {
  const lastVerification = storage.getNumber(LAST_VERIFICATION_KEY) || 0;
  return Date.now() - lastVerification < VERIFICATION_COOLDOWN;
};

const setCooldown = (): void => {
  storage.set(LAST_VERIFICATION_KEY, Date.now());
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

export const FaceVerifyScreen: React.FC<FaceVerifyScreenProps> = ({
  showCamera,
  onVerificationComplete,
  onCancel,
  handleTakePhoto,
}) => {
  const [state, setState] = React.useState<VerificationState>({
    status: 'idle',
    loading: true,
    error: null,
    attempts: 0,
    cooldownUntil: null,
    lastResult: null,
  });

  const [blazefaceModel, setBlazefaceModel] = React.useState<any>(null);
  const [mobileFaceNet, setMobileFaceNet] = React.useState<any>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const isUnmounted = React.useRef(false);

  // Initialize models
  React.useEffect(() => {
    const initializeModels = async () => {
      try {
        const { blazefaceModel, mobileFaceNet } = await loadModels();

        if (isUnmounted.current) return;

        setBlazefaceModel(blazefaceModel);
        setMobileFaceNet(mobileFaceNet);

        // Check initial state
        const attempts = getVerificationAttempts();
        const inCooldown = isInCooldown();

        setState((prev) => ({
          ...prev,
          loading: false,
          attempts,
          status: attempts >= MAX_VERIFICATION_ATTEMPTS ? 'blocked' : 'idle',
          cooldownUntil: inCooldown ? Date.now() + VERIFICATION_COOLDOWN : null,
        }));
      } catch (error) {
        console.error('Failed to initialize models:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load AI models',
          status: 'fail',
        }));
      }
    };

    initializeModels();

    return () => {
      isUnmounted.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle back button
  React.useEffect(() => {
    const backAction = () => {
      if (state.status === 'processing') {
        Alert.alert(
          'Cancel Verification?',
          'Face verification is in progress.',
          [
            { text: 'Wait', style: 'cancel' },
            {
              text: 'Cancel',
              style: 'destructive',
              onPress: () => onCancel?.(),
            },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [state.status, onCancel]);

  // Cooldown timer
  React.useEffect(() => {
    if (state.cooldownUntil && state.cooldownUntil > Date.now()) {
      const timer = setInterval(() => {
        const remaining = state.cooldownUntil! - Date.now();
        if (remaining <= 0) {
          setState((prev) => ({ ...prev, cooldownUntil: null }));
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.cooldownUntil]);

  // const handleVerificationTimeout = React.useCallback(() => {
  //   setState((prev) => ({
  //     ...prev,
  //     status: 'fail',
  //     error: 'Verification timeout',
  //   }));
  //   Alert.alert('Timeout', 'Verification took too long. Please try again.');
  // }, []);

  const onVerifyPhoto = React.useCallback(
    async (photo: { uri: string }) => {
      if (!blazefaceModel || !mobileFaceNet) {
        setState((prev) => ({ ...prev, error: 'Model belum siap' }));
        return;
      }

      setState((prev) => ({ ...prev, status: 'processing', error: null }));

      let imageTensor: tf.Tensor3D | null = null;

      try {
        const savedEmbedding = getStoredEmbedding();
        if (!savedEmbedding) throw new Error('Belum ada wajah yang terdaftar');

        const response = await fetch(photo.uri);
        const buffer = await response.arrayBuffer();
        imageTensor = decodeJpeg(new Uint8Array(buffer));

        const predictions = await blazefaceModel.estimateFaces(
          imageTensor,
          false,
          1,
          true
        );

        if (!predictions || predictions.length === 0)
          throw new Error('Wajah tidak terdeteksi');

        const face = predictions[0];

        if (face.probability && face.probability < 0.8)
          throw new Error('Confidence wajah terlalu rendah');

        const currentEmbedding = await getFaceEmbedding(
          photo.uri,
          face,
          mobileFaceNet,
          { margin: 0.3, targetSize: [224, 224], normalize: true }
        );

        if (!currentEmbedding) throw new Error('Gagal memproses wajah');

        const similarity = cosineSimilarity(currentEmbedding, savedEmbedding);
        const attempts = incrementVerificationAttempts();

        const cocok = similarity >= SIMILARITY_THRESHOLD;

        const result: VerificationResult = {
          success: cocok,
          similarity,
          confidence: face.probability || 0,
          attempts,
        };

        if (cocok) {
          resetVerificationAttempts();
          Vibration.vibrate(100);
          setState((prev) => ({
            ...prev,
            status: 'success',
            lastResult: result,
          }));
        } else {
          // similarity < 70%, user harus ulangi
          setCooldown();
          setState((prev) => ({
            ...prev,
            status: 'fail',
            cooldownUntil: Date.now() + VERIFICATION_COOLDOWN,
            lastResult: result,
            error: `Wajah tidak cukup cocok (${(similarity * 100).toFixed(1)}%). Silakan coba lagi.`,
          }));

          Alert.alert(
            'Verifikasi Gagal',
            `Wajah tidak cukup cocok (${(similarity * 100).toFixed(1)}%). Silakan coba lagi.`,
            [{ text: 'Ulangi', style: 'default' }]
          );
        }

        onVerificationComplete(result);
      } catch (error) {
        const attempts = incrementVerificationAttempts();
        const errorMessage =
          error instanceof Error ? error.message : 'Verifikasi gagal';

        setState((prev) => ({
          ...prev,
          status: 'fail',
          error: errorMessage,
          attempts,
        }));

        Alert.alert('Verifikasi Error', errorMessage, [
          { text: 'Ulangi', style: 'default' },
        ]);
      } finally {
        imageTensor?.dispose();
      }
    },
    [blazefaceModel, mobileFaceNet, onVerificationComplete]
  );

  const internalHandleTakePhoto = React.useCallback(
    async (photo: { uri: string; base64: string }) => {
      // 1. Kirim ke parent handler kalau ada
      if (handleTakePhoto) {
        await handleTakePhoto(photo);
      }

      // 2. Langsung lakukan verifikasi setelah foto diambil
      await onVerifyPhoto(photo);
    },
    [handleTakePhoto, onVerifyPhoto]
  );

  // Render loading state
  if (state.loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2 text-gray-600">Loading AI models...</Text>
      </View>
    );
  }

  // Render error state
  if (state.error && state.status !== 'processing') {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center text-red-600">{state.error}</Text>
        <Button
          label="Retry"
          onPress={() =>
            setState((prev) => ({ ...prev, status: 'idle', error: null }))
          }
        />
        {onCancel && (
          <Button
            label="Cancel"
            onPress={onCancel}
            variant="outline"
            className="mt-2"
          />
        )}
      </View>
    );
  }

  // Render blocked state
  if (state.status === 'blocked') {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center text-xl font-bold text-red-600">
          🔒 Account Locked
        </Text>
        <Text className="mb-4 text-center text-gray-600">
          Too many failed verification attempts.
        </Text>
        <Button label="Contact Support" onPress={() => onCancel?.()} />
      </View>
    );
  }

  // Render cooldown state
  if (state.cooldownUntil && state.cooldownUntil > Date.now()) {
    const remainingSeconds = Math.ceil(
      (state.cooldownUntil - Date.now()) / 1000
    );
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center text-xl font-bold text-orange-600">
          ⏱️ Please Wait
        </Text>
        <Text className="mb-4 text-center text-gray-600">
          Try again in {remainingSeconds} seconds
        </Text>
        {onCancel && (
          <Button label="Cancel" onPress={onCancel} variant="outline" />
        )}
      </View>
    );
  }

  const isCapturing = state.status === 'processing';
  // Render main verification interface
  return (
    <View className="flex-1">
      {state.status === 'idle' && showCamera && (
        <CameraSectionVerify
          showCamera={showCamera}
          onTakePhoto={internalHandleTakePhoto}
          isCapturing={isCapturing}
        />
      )}

      {state.status === 'processing' && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="mt-4 text-lg text-gray-600">Verifying face...</Text>
          <Text className="mt-2 text-sm text-gray-400">Please wait</Text>
        </View>
      )}

      {state.status === 'success' && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold text-green-600">
            ✅ Verification Successful
          </Text>
          {state.lastResult && (
            <Text className="mt-2 text-gray-600">
              Similarity: {(state.lastResult.similarity * 100).toFixed(1)}%
            </Text>
          )}
        </View>
      )}

      {state.status === 'fail' && (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="mb-2 text-2xl font-bold text-red-600">
            ❌ Verification Failed
          </Text>
          {state.lastResult && (
            <Text className="mb-2 text-gray-600">
              Similarity: {(state.lastResult.similarity * 100).toFixed(1)}%
            </Text>
          )}
          <Text className="mb-4 text-center text-gray-600">
            Attempts: {state.attempts}/{MAX_VERIFICATION_ATTEMPTS}
          </Text>
        </View>
      )}

      {/* Status bar */}
      <View className="absolute inset-x-4 top-12">
        <View className="rounded-lg bg-white/90 p-3 shadow-sm">
          <Text className="text-center text-sm text-gray-600">
            Face Verification • {state.attempts}/{MAX_VERIFICATION_ATTEMPTS}{' '}
            attempts
          </Text>
        </View>
      </View>
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
