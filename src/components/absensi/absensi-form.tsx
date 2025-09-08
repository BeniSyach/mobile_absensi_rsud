/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
import '@tensorflow/tfjs-react-native';

import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, CameraIcon, Save } from 'lucide-react-native';
import * as React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Alert } from 'react-native';
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

import { type FormType } from './absensi-types';
import { useAbsensiForm } from './use-absensi-form';

// MMKV storage
const storage = new MMKV({ id: 'face-auth' });
const FACE_EMBED_KEY = 'face_embedding';

// Fungsi untuk hitung jarak Euclidean
function euclideanDistance(a: Float32Array, b: Float32Array) {
  if (a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
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

// ===== Camera + Capture Component =====
interface CameraSectionProps {
  showCamera: boolean;
  handleTakePhoto: (photo: { uri: string; base64: string }) => Promise<void>;
}

const CameraSectionVerify: React.FC<CameraSectionProps> = ({
  showCamera,
  handleTakePhoto,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = React.useState<CameraType>('front');
  const cameraRef = React.useRef<CameraView>(null);

  if (!showCamera) return null;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="mt-2 items-center">
        <Text className="mb-2 text-gray-400">
          Aplikasi Membutuhkan Izin Akses Kamera
        </Text>
        <Button label="Izinkan Akses Kamera" onPress={requestPermission} />
      </View>
    );
  }

  const onTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = (await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.2,
          exif: false,
          skipProcessing: true,
        })) as { uri: string; base64: string };

        await handleTakePhoto({
          uri: photo.uri,
          base64: photo.base64 || '',
        });
      } catch (error) {
        console.error('Failed to take photo:', error);
      }
    }
  };

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} className="flex-1" facing={facing}>
        <View className="h-96 w-full flex-1 items-end justify-end bg-transparent px-4 pb-4">
          <Button
            label="Ambil Foto"
            onPress={onTakePhoto}
            icon={<Camera size={20} color={'white'} />}
          />
        </View>
      </CameraView>
    </View>
  );
};

interface FaceVerifyScreenProps {
  showCamera: boolean;
  handleTakePhoto: (photo: { uri: string; base64: string }) => Promise<void>;
}

export const FaceVerifyScreen: React.FC<FaceVerifyScreenProps> = ({
  showCamera,
  handleTakePhoto,
}) => {
  const [verifying, setVerifying] = React.useState(false);
  const [blazefaceModel, setBlazefaceModel] =
    React.useState<blazeface.BlazeFaceModel | null>(null);

  React.useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const model = await blazeface.load();
      setBlazefaceModel(model);
      console.log('✅ BlazeFace ready');
    };
    loadModel();
  }, []);

  const onVerifyPhoto = async (photo: { uri: string; base64: string }) => {
    if (!blazefaceModel) return;
    setVerifying(true);
    try {
      const response = await fetch(photo.uri);
      const buffer = await response.arrayBuffer();
      const imageTensor = decodeJpeg(new Uint8Array(buffer));

      const predictions = await blazefaceModel.estimateFaces(
        imageTensor,
        false
      );
      imageTensor.dispose();

      if (!predictions.length) {
        Alert.alert('Verifikasi gagal', 'Wajah tidak terdeteksi');
        setVerifying(false);
        return;
      }

      const topLeft = predictions[0].topLeft as [number, number];
      const bottomRight = predictions[0].bottomRight as [number, number];
      const newEmbedding = new Float32Array([...topLeft, ...bottomRight]);

      const savedStr = storage.getString(FACE_EMBED_KEY);
      if (!savedStr) {
        Alert.alert('Verifikasi gagal', 'Belum ada wajah tersimpan');
        setVerifying(false);
        return;
      }

      const savedEmbedding = new Float32Array(JSON.parse(savedStr));
      const distance = euclideanDistance(newEmbedding, savedEmbedding);
      const THRESHOLD = 10;

      if (distance <= THRESHOLD) {
        Alert.alert('Verifikasi sukses', 'Wajah sesuai');
      } else {
        Alert.alert('Verifikasi gagal', 'Wajah tidak cocok');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Verifikasi gagal', 'Terjadi kesalahan');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View className="flex-1">
      {showCamera && !verifying && (
        <CameraSectionVerify
          showCamera={showCamera}
          handleTakePhoto={async (photo) => {
            await handleTakePhoto(photo); // dari parent
            await onVerifyPhoto(photo); // proses verifikasi di sini
          }}
        />
      )}
      {verifying && (
        <View className="flex-1 items-center justify-center">
          <Text>Memverifikasi wajah...</Text>
        </View>
      )}
      {!showCamera && !verifying && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-bold">✅ Verifikasi selesai</Text>
        </View>
      )}
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
    const handleTakePhoto = async (photo: { uri: string; base64?: string }) => {
      onImageSelect({
        uri: photo.uri,
        base64: photo.base64 ?? '', // selalu kirim string
      });
      setShowCamera(false);
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
          handleTakePhoto={handleTakePhoto}
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
