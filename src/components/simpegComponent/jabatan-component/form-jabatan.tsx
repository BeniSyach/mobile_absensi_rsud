import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  ditetapkan: z.string(),
  tanggal_sk: z.string(),
  nomor_sk: z.string(),
  tmt_jabatan: z.string(),
  jabatan: z.string(),
  jenjang_jabatan: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type JabatanFormProps = {
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
        name="tanggal_sk"
        label="Tanggal SK"
        error={errors.tanggal_sk?.message}
      />

      <ControlledInput
        control={control}
        name="nomor_sk"
        label="Nomor SK"
        error={errors.nomor_sk?.message}
      />

      <ControlledInput
        control={control}
        name="tmt_jabatan"
        label="TMT Jabatan"
        error={errors.tmt_jabatan?.message}
      />

      <ControlledInput
        control={control}
        name="jabatan"
        label="Jabatan"
        error={errors.jabatan?.message}
      />

      <ControlledInput
        control={control}
        name="jenjang_jabatan"
        label="Jenjang Jabatan"
        error={errors.jenjang_jabatan?.message}
      />
    </>
  );
}

const FormJabatan = forwardRef<
  { submit: () => Promise<boolean> },
  JabatanFormProps
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
      <Text className="mb-4 text-xl font-bold text-[#0B3880]">Jabatan</Text>

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

export { FormJabatan };
