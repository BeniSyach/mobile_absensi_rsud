import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  jurusan: z.string(),
  tingkat_pendidikan: z.string(),
  nama_perguruan: z.string(),
  lokasi: z.string(),
  rektor_kepsek: z.string(),
  akreditasi: z.string(),
  tanggal_lulus: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type PendidikanFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

function FormFields({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <ControlledInput
        control={control}
        name="jurusan"
        label="Jurusan"
        error={errors.jurusan?.message}
      />

      <ControlledInput
        control={control}
        name="tingkat_pendidikan"
        label="Tingkat Pendidikan"
        error={errors.tingkat_pendidikan?.message}
      />

      <ControlledInput
        control={control}
        name="nama_perguruan"
        label="Nama Perguruan"
        error={errors.nama_perguruan?.message}
      />

      <ControlledInput
        control={control}
        name="lokasi"
        label="Lokasi"
        error={errors.lokasi?.message}
      />

      <ControlledInput
        control={control}
        name="rektor_kepsek"
        label="Rektor/Kepsek"
        error={errors.rektor_kepsek?.message}
      />

      <ControlledInput
        control={control}
        name="akreditasi"
        label="Akreditasi"
        error={errors.akreditasi?.message}
      />

      <ControlledInput
        control={control}
        name="tanggal_lulus"
        label="Tanggal Lulus"
        error={errors.tanggal_lulus?.message}
      />
    </>
  );
}

const FormPendidikan = forwardRef<
  { submit: () => Promise<boolean> },
  PendidikanFormProps
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
      <Text className="mb-4 text-xl font-bold text-[#0B3880]">Pendidikan</Text>

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

export { FormPendidikan };
