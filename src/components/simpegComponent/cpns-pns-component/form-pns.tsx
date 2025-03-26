import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  nomor_sk_pns: z.string(),
  tanggal_sk_pns: z.string(),
  tmt_sk_pns: z.string(),
  jenis_jabatan: z.string(),
  sumpah: z.string(),
  tahun_sumpah: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type PnsFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

function FormFields({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <ControlledInput
        control={control}
        name="nomor_sk_pns"
        label="Nomor SK PNS"
        error={errors.nomor_sk_pns?.message}
      />

      <ControlledInput
        control={control}
        name="tanggal_sk_pns"
        label="Tanggal SK PNS"
        error={errors.tanggal_sk_pns?.message}
      />

      <ControlledInput
        control={control}
        name="tmt_sk_pns"
        label="TMT SK PNS"
        error={errors.tmt_sk_pns?.message}
      />

      <ControlledInput
        control={control}
        name="jenis_jabatan"
        label="Jenis Jabatan"
        error={errors.jenis_jabatan?.message}
      />

      <ControlledInput
        control={control}
        name="sumpah"
        label="Sumpah"
        error={errors.sumpah?.message}
      />

      <ControlledInput
        control={control}
        name="tahun_sumpah"
        label="Tahun Sumpah"
        error={errors.tahun_sumpah?.message}
      />
    </>
  );
}

const FormPns = forwardRef<{ submit: () => Promise<boolean> }, PnsFormProps>(
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
        <Text className="mb-4 text-xl font-bold text-[#0B3880]">PNS</Text>
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

export { FormPns };
