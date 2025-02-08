import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as React from 'react';
import type { SubmitHandler } from 'react-hook-form';

import { type GetUserDetailResponse } from '@/api';
import type { Location } from '@/api/lokasi/types';
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

export type AbsensiFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<FormType>;
  location: Location;
  user: GetUserDetailResponse;
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

const CameraSection = React.memo<{
  showCamera: boolean;
  handleTakePhoto: (photo: { uri: string; base64: string }) => Promise<void>;
}>(({ showCamera, handleTakePhoto }) => {
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
        <Text className="mb-2">Aplikasi Membutuhkan Izin Akses Kamera</Text>
        <Button label="Izinkan Akses Kamera" onPress={requestPermission} />
      </View>
    );
  }

  const onTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = (await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1,
          exif: false,
          skipProcessing: false,
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
          <Button label="Ambil Foto" onPress={onTakePhoto} />
        </View>
      </CameraView>
    </View>
  );
});

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
          contentFit="cover"
          transition={1000}
          style={{ width: 300, height: 300 }}
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
    <>
      <Select
        label="Tipe Absensi"
        options={tipe_absensi}
        value={tipe_absensi_value}
        onSelect={onTipeAbsensiSelect}
        placeholder="Pilih Tipe Absensi"
        error={errors.tipe_absensi?.message}
        disabled={true}
      />
      <Select
        label="Tipe Shift"
        options={shiftOptions}
        value={shift_value}
        onSelect={onShiftSelect}
        placeholder="Pilih Tipe Shift"
        error={errors.shift_id?.message}
      />
      <Select
        label="Shift/Hari Kerja"
        options={hariKerjaOptions}
        value={hari_kerja_value}
        onSelect={onHariKerjaSelect}
        placeholder="Pilih Hari Kerja"
        error={errors.waktu_kerja_id?.message}
      />
    </>
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
    const handleTakePhoto = async (photo: { uri: string; base64: string }) => {
      onImageSelect(photo);
      setShowCamera(false);
    };

    console.log(errors);
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
        />
        <CameraSection
          showCamera={showCamera}
          handleTakePhoto={handleTakePhoto}
        />
        <ImagePreview image={image} showCamera={showCamera} errors={errors} />
      </>
    );
  }
);

const FormContainer = React.memo<{
  children: React.ReactNode;
  onSubmit: () => void;
  isPending: boolean;
}>(({ children, onSubmit, isPending }) => (
  <ScrollView className="flex-1 p-4">
    {children}
    <Button
      label="Absen"
      loading={isPending}
      onPress={onSubmit}
      size="lg"
      className="mb-20"
      testID="add-post-button"
    />
  </ScrollView>
));

export const AbsensiForm: React.FC<AbsensiFormProps> = React.memo(
  ({ isPending, onSubmit, location, user }) => {
    const { handleSubmit, handleLocationUpdate, formFieldProps } =
      useAbsensiForm(user);

    return (
      <FormContainer onSubmit={handleSubmit(onSubmit)} isPending={isPending}>
        <Maps
          selectedLatitude={parseFloat(location.latitude)}
          selectedLongitude={parseFloat(location.longitude)}
          radius={location.radius}
          onLocationUpdate={handleLocationUpdate}
        />
        <FormFields {...formFieldProps} />
      </FormContainer>
    );
  }
);

CameraSection.displayName = 'CameraSection';
ImagePreview.displayName = 'ImagePreview';
FormFields.displayName = 'FormFields';
FormContainer.displayName = 'FormContainer';
AbsensiForm.displayName = 'AbsensiForm';
