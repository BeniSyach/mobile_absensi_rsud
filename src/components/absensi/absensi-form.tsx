import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { type GetUserDetailResponse } from '@/api';
import type { WaktuKerjaResponse } from '@/api/hari-kerja/types';
import type { Location } from '@/api/lokasi/types';
import { type GetShiftResponseArray } from '@/api/shift/types';
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

import LoadingComponent from '../ui/loading';
import { UseFormState } from './use-form-state';

export const schema = z.object({
  tipe_absensi: z.string({ required_error: 'Tipe Absensi Tidak Boleh Kosong' }),
  shift_id: z.string({ required_error: 'Shift Tidak Boleh Kosong' }),
  waktu_kerja_id: z.string({ required_error: 'Hari Kerja Tidak Boleh Kosong' }),
  photo: z.string({ required_error: 'Photo Tidak Boleh Kosong' }),
  longitude: z.string({ required_error: 'Lokasi Tidak Boleh Kosong' }),
  latitude: z.string({ required_error: 'Lokasi Tidak Boleh Kosong' }),
  mimeType: z.string({ required_error: 'Photo Tidak Boleh Kosong' }),
  name: z.string({ required_error: 'photo Tidak Boleh Kosong' }),
  absen_masuk_id: z.string().optional(),
});

export type FormType = z.infer<typeof schema>;

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

const getShiftOptions = (
  shifts: GetShiftResponseArray | undefined
): OptionType[] =>
  shifts?.map((d) => ({
    value: d.id,
    label: d.nama_shift,
  })) || [];

const getWorkTimeOptions = (
  workTimes: WaktuKerjaResponse | undefined
): OptionType[] =>
  workTimes?.map((w) => ({
    value: w.id,
    label: w.hari.nama_hari,
  })) || [];

interface FormFieldsProps {
  tipe_absensi_value: string | number | undefined;
  shift_value: string | number | undefined;
  hari_kerja_value: string | number | undefined;
  tipe_shift: OptionType[];
  tipe_hari_kerja: OptionType[];
  onTipeAbsensiSelect: (value: string | number) => void;
  onShiftSelect: (value: string | number) => void;
  onHariKerjaSelect: (value: string | number) => void;
  onImageSelect: () => Promise<void>;
  image: string | null;
  mimeType: string | null;
  name: string | null;
  errors: any;
  isTipeAbsensiDisabled: boolean;
}

const FormFields: React.FC<FormFieldsProps> = ({
  tipe_absensi_value,
  shift_value,
  hari_kerja_value,
  tipe_shift,
  tipe_hari_kerja,
  onTipeAbsensiSelect,
  onShiftSelect,
  onHariKerjaSelect,
  onImageSelect,
  image,
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
      options={tipe_shift}
      value={shift_value}
      onSelect={onShiftSelect}
      placeholder="Pilih Tipe Absensi"
      error={errors.shift_id?.message}
    />
    <Select
      label="Shift/Hari Kerja"
      options={tipe_hari_kerja}
      value={hari_kerja_value}
      onSelect={onHariKerjaSelect}
      placeholder="Pilih Tipe Absensi"
      error={errors.waktu_kerja_id?.message}
    />
    <Button label="Ambil Foto Absensi" onPress={onImageSelect} />
    {image ? (
      <View className="mt-2 items-center">
        <Image
          source={{ uri: image }}
          className="h-44 w-full"
          style={{ resizeMode: 'contain' }}
        />
      </View>
    ) : (
      errors.photo && (
        <View className="mb-2">
          <Text className="text-red-500">
            {errors.photo?.message || 'Belum ada foto yang diunggah.'}
          </Text>
        </View>
      )
    )}
  </>
);

const FormContainer: React.FC<{
  children: React.ReactNode;
  onSubmit: () => void;
  isPending: boolean;
}> = ({ children, onSubmit, isPending }) => (
  <ScrollView className="flex-1 p-4">
    {children}
    <Button
      label="Absen Masuk"
      loading={isPending}
      onPress={onSubmit}
      size="lg"
      testID="add-post-button"
    />
  </ScrollView>
);

export const AbsensiForm: React.FC<AbsensiFormProps> = ({
  isPending,
  onSubmit,
  location,
  user,
}) => {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const state = UseFormState(setValue);
  // Determine if the user can mark "Masuk" or "Pulang" based on the last attendance status
  const isTipeAbsensiDisabled = user.lastAbsenStatus?.status === 1; // If status is 1, disable "Masuk"
  const initialTipeAbsensiValue =
    user.lastAbsenStatus?.status === 1 ? '1' : '0'; // Default to "Pulang" if status is 1
  // Set initial value for "tipe_absensi"
  React.useEffect(() => {
    setValue('tipe_absensi', initialTipeAbsensiValue);
    if (user.lastAbsenStatus?.absen_masuk_id) {
      setValue(
        'absen_masuk_id',
        user.lastAbsenStatus.absen_masuk_id.toString()
      );
    }
  }, [initialTipeAbsensiValue, user.lastAbsenStatus?.absen_masuk_id, setValue]);

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)} isPending={isPending}>
      {location.latitude && location.longitude && location.radius ? (
        <Maps
          selectedLatitude={parseFloat(location.latitude)}
          selectedLongitude={parseFloat(location.longitude)}
          radius={location.radius}
          onLocationUpdate={(lat, lng) => {
            console.log('Updated Location:', lat, lng);
            state.setLatitude(lat.toString());
            state.setLongitude(lng.toString());
          }}
        />
      ) : (
        <LoadingComponent />
      )}
      <FormFields
        {...{
          tipe_absensi_value: initialTipeAbsensiValue,
          shift_value: state.shift,
          hari_kerja_value: state.hari_kerja,
          tipe_shift: getShiftOptions(state.shifts),
          tipe_hari_kerja: getWorkTimeOptions(state.workTimes),
          onTipeAbsensiSelect: state.Settipe_absensi,
          onShiftSelect: state.Setshift,
          onHariKerjaSelect: state.Sethari_kerja,
          onImageSelect: state.takePhoto,
          image: state.image,
          mimeType: state.mimeType,
          name: state.name,
          user,
          errors,
          isTipeAbsensiDisabled,
        }}
      />
    </FormContainer>
  );
};
