import React from 'react';
import { useForm } from 'react-hook-form';

import type { PostSPTVariables } from '@/api/spt/types';
import { Button, ControlledInput, Text, View } from '@/components/ui';

export type SptFormProps = {
  onSubmit: (data: PostSPTVariables) => void;
  isPending: boolean;
  isError?: boolean;
};

const FormFields = ({ control, errors }: { control: any; errors: any }) => (
  <>
    <ControlledInput
      control={control}
      name="id_user"
      label="ID User"
      keyboardType="numeric"
      error={errors.id_user?.message}
    />
    <ControlledInput
      control={control}
      name="tanggal_spt"
      label="Tanggal SPT"
      placeholder="YYYY-MM-DD"
      error={errors.tanggal_spt?.message}
    />
    <ControlledInput
      control={control}
      name="waktu_spt"
      label="Waktu SPT"
      placeholder="HH:mm:ss"
      error={errors.waktu_spt?.message}
    />
    <ControlledInput
      control={control}
      name="lama_acara"
      label="Lama Acara"
      keyboardType="numeric"
      error={errors.lama_acara?.message}
    />
    <ControlledInput
      control={control}
      name="lokasi_spt"
      label="Lokasi SPT"
      placeholder="Lokasi acara"
      error={errors.lokasi_spt?.message}
    />
    <ControlledInput
      control={control}
      name="file_spt"
      label="File SPT"
      placeholder="Masukkan path file"
      error={errors.file_spt?.message}
    />
  </>
);

export default function SptForm({
  onSubmit,
  isPending,
  isError,
}: SptFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSPTVariables>();

  return (
    <View className="p-4">
      <FormFields control={control} errors={errors} />
      {isError && (
        <View className="my-2">
          <Text className="text-red-500">Terjadi kesalahan, coba lagi.</Text>
        </View>
      )}
      <Button
        label="Submit SPT"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
        testID="submit-spt-button"
      />
    </View>
  );
}
