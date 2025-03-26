import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  ditetapkan: z.string(),
  no_sk: z.string(),
  tanggal_sk: z.string(),
  golongan_ruang: z.string(),
  masa_kerja_bulan: z.string(),
  masa_kerja_tahun: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type PangkatGolonganFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

function FormFields({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <ControlledInput
        control={control}
        name="ditetapkan"
        label="Ditetapkan"
        error={errors.ditetapkan?.message}
      />

      <ControlledInput
        control={control}
        name="no_sk"
        label="No. SK"
        error={errors.no_sk?.message}
      />

      <ControlledInput
        control={control}
        name="tanggal_sk"
        label="Tanggal SK"
        error={errors.tanggal_sk?.message}
      />

      <ControlledInput
        control={control}
        name="golongan_ruang"
        label="Golongan Ruang"
        error={errors.golongan_ruang?.message}
      />

      <ControlledInput
        control={control}
        name="masa_kerja_bulan"
        label="Masa Kerja (bulan)"
        error={errors.masa_kerja_bulan?.message}
      />

      <ControlledInput
        control={control}
        name="masa_kerja_tahun"
        label="Masa Kerja (tahun)"
        error={errors.masa_kerja_tahun?.message}
      />
    </>
  );
}

const FormPangkatGolongan = forwardRef<
  { submit: () => Promise<boolean> },
  PangkatGolonganFormProps
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
      <Text className="mb-4 text-xl font-bold text-[#0B3880] ">
        Pangkat & Golongan
      </Text>

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

export { FormPangkatGolongan };
