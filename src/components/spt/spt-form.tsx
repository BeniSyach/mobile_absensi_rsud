import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';

import { DateInput } from '../ui/date-input';
import { FileUploadInput } from '../ui/file-upload-input';
import { TimeInput } from '../ui/time-input';

const schema = z.object({
  tanggal_spt: z
    .string({
      required_error: 'Tanggal SPT diperlukan',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Tanggal tidak valid',
    }),
  waktu_spt: z
    .string({
      required_error: 'Waktu SPT diperlukan',
    })
    .regex(/^\d{2}:\d{2}:\d{2}$/, 'Format waktu harus HH:mm:ss'),
  lama_acara: z.string({
    required_error: 'Lama acara diperlukan',
  }),
  lokasi_spt: z
    .string({
      required_error: 'Lokasi SPT diperlukan',
    })
    .min(3, 'Lokasi harus lebih dari 3 karakter'),
  file_spt: z
    .any({
      required_error: 'File SPT diperlukan',
    })
    .refine((file) => file?.type === 'application/pdf', {
      message: 'File harus berupa PDF',
    }),
  name: z.string().optional(),
  mimeType: z.string().optional(),
});

export type FormType = z.infer<typeof schema>;

export type SptFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

const FormFields = ({ control, errors }: { control: any; errors: any }) => {
  return (
    <>
      <DateInput
        control={control}
        name="tanggal_spt"
        label="Tanggal SPT"
        placeholder="YYYY-MM-DD"
        error={errors.tanggal_spt?.message}
      />
      <TimeInput
        control={control}
        name="waktu_spt"
        label="Waktu SPT"
        placeholder="HH:mm:ss"
        error={errors.waktu_spt?.message}
      />
      <ControlledInput
        control={control}
        name="lama_acara"
        label="Lama Acara /hari"
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
      <FileUploadInput
        control={control}
        name="file_spt"
        label="File SPT"
        placeholder="Pilih file PDF"
        error={errors.file_spt?.message}
      />
    </>
  );
};

export default function SptForm({
  onSubmit,
  isPending,
  isError,
}: SptFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({ resolver: zodResolver(schema) });

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
        size="lg"
        testID="submit-spt-button"
      />
    </View>
  );
}
