import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { WaktuKerjaResponse } from '@/api/hari-kerja/types';
import type { Location } from '@/api/lokasi/types';
import { type GetShiftResponseArray } from '@/api/shift/types';
import Maps from '@/components/absensi/maps';
import {
  Button,
  Image,
  type OptionType,
  Select,
  Text,
  View,
} from '@/components/ui';

import { UseFormState } from './use-form-state';

export const schema = z.object({
  tipe_absensi: z.string({ required_error: 'Tipe Absensi Tidak Boleh Kosong' }),
  shift: z.string({ required_error: 'Shift Tidak Boleh Kosong' }),
  hari_kerja: z.string({ required_error: 'Hari Kerja Tidak Boleh Kosong' }),
  photo: z.string({ required_error: 'Photo Tidak Boleh Kosong' }),
  longitude: z.string({ required_error: 'Lokasi Tidak Boleh Kosong' }),
  latitude: z.string({ required_error: 'Lokasi Tidak Boleh Kosong' }),
  mimeType: z.string({ required_error: 'Photo Tidak Boleh Kosong' }),
  name: z.string({ required_error: 'photo Tidak Boleh Kosong' }),
});

export type FormType = z.infer<typeof schema>;

interface AbsensiFormProps {
  isPending: boolean;
  onSubmit: () => void;
  location: Location;
}

const tipe_absensi: OptionType[] = [
  { value: 'Masuk', label: 'Masuk' },
  { value: 'Pulang', label: 'Pulang' },
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
    />
    <Select
      label="Tipe Shift"
      options={tipe_shift}
      value={shift_value}
      onSelect={onShiftSelect}
      placeholder="Pilih Tipe Absensi"
      error={errors.shift?.message}
    />
    <Select
      label="Shift/Hari Kerja"
      options={tipe_hari_kerja}
      value={hari_kerja_value}
      onSelect={onHariKerjaSelect}
      placeholder="Pilih Tipe Absensi"
      error={errors.hari_kerja?.message}
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
  <View className="flex-1 p-4">
    {children}
    <Button
      label="Absen Masuk"
      loading={isPending}
      onPress={onSubmit}
      size="lg"
      testID="add-post-button"
    />
  </View>
);

export const AbsensiForm: React.FC<AbsensiFormProps> = ({
  isPending,
  onSubmit,
  location,
}) => {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const state = UseFormState(setValue);

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)} isPending={isPending}>
      <Maps
        selectedLatitude={parseFloat(location.latitude)}
        selectedLongitude={parseFloat(location.longitude)}
        radius={location.radius}
        onLocationUpdate={(lat, lng) => {
          state.setLatitude(lat.toString());
          state.setLongitude(lng.toString());
        }}
      />
      <FormFields
        {...{
          tipe_absensi_value: state.tipe_absensi,
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
          errors,
        }}
      />
    </FormContainer>
  );
};
