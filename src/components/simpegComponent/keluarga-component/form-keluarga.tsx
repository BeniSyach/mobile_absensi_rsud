import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  status_keluarga: z.string(),
  nama_lengkap: z.string(),
  tempat_lahir: z.string(),
  alamat: z.string(),
  tanggal_lahir: z.string(),
  tanggal_menikah: z.string(),
  jenis_kelamin: z.string(),
  tanggungan: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type KeluargaFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

function FormFields({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <ControlledInput
        control={control}
        name="status_keluarga"
        label="Status Keluarga"
        error={errors.status_keluarga?.message}
      />

      <ControlledInput
        control={control}
        name="nama_lengkap"
        label="Nama Lengkap"
        error={errors.nama_lengkap?.message}
      />

      <ControlledInput
        control={control}
        name="tempat_lahir"
        label="Tempat Lahir"
        error={errors.tempat_lahir?.message}
      />

      <ControlledInput
        control={control}
        name="alamat"
        label="Alamat"
        error={errors.alamat?.message}
      />

      <View className="flex-row justify-between">
        <View className="mr-1 flex-1">
          <ControlledInput
            control={control}
            name="tanggal_lahir"
            label="Tanggal Lahir"
            error={errors.tanggal_lahir?.message}
          />
        </View>
        <View className="mx-2 bg-white"></View>
        <View className="ml-1 flex-1">
          <ControlledInput
            control={control}
            name="tanggal_menikah"
            label="Tanggal Menikah"
            error={errors.tanggal_menikah?.message}
          />
        </View>
      </View>

      <ControlledInput
        control={control}
        name="jenis_kelamin"
        label="Jenis Kelamin"
        error={errors.jenis_kelamin?.message}
      />

      <ControlledInput
        control={control}
        name="tanggungan"
        label="Tanggungan"
        error={errors.tanggungan?.message}
      />
    </>
  );
}

const FormKeluarga = forwardRef<
  { submit: () => Promise<boolean> },
  KeluargaFormProps
>(({ onSubmit, isPending }, ref) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        try {
          await handleSubmit(async (data) => {
            await onSubmit(data);
          })();
          return true;
        } catch {
          return false;
        }
      },
    }),
    [handleSubmit, onSubmit]
  );
  return (
    <View>
      <Text className="mb-4 text-xl font-bold text-[#0B3880]">Keluarga</Text>

      <View style={{ opacity: isPending ? 0.7 : 1 }}>
        <FormFields control={control} errors={errors} />
      </View>
      {isPending && (
        <View className="absolute inset-0 flex items-center justify-center bg-black/10">
          <Text>Menyimpan...</Text>
        </View>
      )}
    </View>
  );
});

export { FormKeluarga };
