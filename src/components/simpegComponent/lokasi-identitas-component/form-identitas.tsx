import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  tanggal_lahir: z
    .string({
      required_error: 'Tanggal Lahir diperlukan',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Tanggal tidak valid',
    }),
  nip_baru: z.string(),
  gelar_depan: z.string(),
  gelar_belakang: z.string(),
  nama_lengkap: z.string(),
  alamat: z.string(),
  tempat_lahir: z.string(),
  jenis_kelamin: z.string(),
  agama: z.string(),
  status_pegawai: z.string(),
  status_kawin: z.string(),
  // nip_baru: z.string().optional(),
  // gelar_depan: z.string().optional(),
  // gelar_belakang: z.string().optional(),
  // nama_lengkap: z.string().optional(),
  // alamat: z.string().optional(),
  // tempat_lahir: z.string().optional(),
  // jenis_kelamin: z.string().optional(),
  // agama: z.string().optional(),
  // status_pegawai: z.string().optional(),
  // status_kawin: z.string().optional(),
});

export type FormType = z.infer<typeof schema>;

export type IdentitasFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

type FieldGroupProps = {
  label1: string;
  label2: string;
  name1: string;
  name2: string;
  error1?: any;
  error2?: any;
  control?: any;
};

function FormFieldGroup({
  label1,
  name1,
  label2,
  name2,
  error1,
  error2,
  control,
}: FieldGroupProps) {
  return (
    <View className="flex-row justify-between">
      <View className="mr-1 flex-1">
        <ControlledInput
          control={control}
          name={name1}
          label={label1}
          error={error1}
        />
      </View>
      <View className="mx-2 bg-white"></View>
      <View className="ml-1 flex-1">
        <ControlledInput
          control={control}
          name={name2}
          label={label2}
          error={error2}
        />
      </View>
    </View>
  );
}

function FormFields({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <ControlledInput
        control={control}
        name="nip_baru"
        label="NIP Baru"
        keyboardType="numeric"
        error={errors.nip_baru?.message}
      />

      <FormFieldGroup
        label1="Gelar Depan"
        name1="gelar_depan"
        label2="Gelar Belakang"
        name2="gelar_belakang"
        control={control}
        error1={errors.gelar_depan?.message}
        error2={errors.gelar_belakang?.message}
      />

      <ControlledInput
        control={control}
        name="nama_lengkap"
        label="Nama Lengkap"
        error={errors.nama_lengkap?.message}
      />

      <ControlledInput
        control={control}
        name="alamat"
        label="Alamat"
        error={errors.alamat?.message}
      />

      <FormFieldGroup
        label1="Tempat Lahir"
        name1="tempat_lahir"
        label2="Tanggal Lahir"
        name2="tanggal_lahir"
        control={control}
        error1={errors.tempat_lahir?.message}
        error2={errors.tanggal_lahir?.message}
      />
      <FormFieldGroup
        label1="Jenis Kelamin"
        name1="jenis_kelamin"
        label2="Agama"
        name2="agama"
        control={control}
        error1={errors.jenis_kelamin?.message}
        error2={errors.agama?.message}
      />
      <FormFieldGroup
        label1="Status Pegawai"
        name1="status_pegawai"
        label2="Status Kawin"
        name2="status_kawin"
        control={control}
        error1={errors.status_pegawai?.message}
        error2={errors.status_kawin?.message}
      />
    </>
  );
}

const FormIdentitas = forwardRef<
  { submit: () => Promise<boolean> },
  IdentitasFormProps
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
      <Text className="mb-4 text-xl font-bold text-[#0B3880]">Identitas</Text>
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

export { FormIdentitas };
