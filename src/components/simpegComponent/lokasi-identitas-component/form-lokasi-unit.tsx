import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  unit_kerja: z.string(),
  sub_unit_kerja: z.string(),
  jenis_jabatan: z.string(),
  jabatan: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type lokasiIdentitasFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

function FormFields({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <ControlledInput
        control={control}
        name="unit_kerja"
        label="Unit Kerja"
        error={errors.unit_kerja?.message}
      />

      <ControlledInput
        control={control}
        name="sub_unit_kerja"
        label="Sub Unit Kerja"
        error={errors.sub_unit_kerja?.message}
      />

      <ControlledInput
        control={control}
        name="jenis_jabatan"
        label="Jenis Jabatan"
        error={errors.jenis_jabatan?.message}
      />

      <ControlledInput
        control={control}
        name="jabatan"
        label="Jabatan"
        error={errors.jabatan?.message}
      />
    </>
  );
}

const FormLokasiUnit = forwardRef<
  { submit: () => Promise<boolean> },
  lokasiIdentitasFormProps
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
      <Text className="mb-4 text-xl font-bold text-[#0B3880]">Lokasi Unit</Text>
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

export { FormLokasiUnit };
