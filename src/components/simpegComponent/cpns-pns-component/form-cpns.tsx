import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  nomor_sk_cpns: z.string(),
  tanggal_sk_cpns: z.string(),
  tmt_sk_cpns: z.string(),
  golongan_ruang: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type CpnsFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

function FormFields({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <ControlledInput
        control={control}
        name="nomor_sk_cpns"
        label="Nomor SK CPNS"
        error={errors.nomor_sk_cpns?.message}
      />

      <ControlledInput
        control={control}
        name="tanggal_sk_cpns"
        label="Tanggal SK CPNS"
        error={errors.tanggal_sk_cpns?.message}
      />

      <ControlledInput
        control={control}
        name="tmt_sk_cpns"
        label="TMT SK CPNS"
        error={errors.tmt_sk_cpns?.message}
      />

      <ControlledInput
        control={control}
        name="golongan_ruang"
        label="Golongan Ruang"
        error={errors.golongan_ruang?.message}
      />
    </>
  );
}

const FormCpns = forwardRef<{ submit: () => Promise<boolean> }, CpnsFormProps>(
  ({ onSubmit, isPending }, ref) => {
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
        <Text className="mb-4 text-xl font-bold text-[#0B3880]">CPNS</Text>
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
  }
);

export { FormCpns };
