import { zodResolver } from '@hookform/resolvers/zod';
import React, { forwardRef, useImperativeHandle } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  diklat: z.string(),
  tempat: z.string(),
  penyelenggara: z.string(),
  tanggal_mulai: z.string(),
  tanggal_akhir: z.string(),
  jumlah_jam: z.string(),
  nomor_sertifikat: z.string(),
  tanggal_sertifikat: z.string(),
  angkatan: z.string(),
});

export type FormType = z.infer<typeof schema>;

export type DiklatTeknisFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
  isError?: boolean;
};

function DateInputGroup({
  control,
  errors,
  names,
  labels,
}: {
  control: any;
  errors: any;
  names: [string, string];
  labels: [string, string];
}) {
  return (
    <View className="flex-row justify-between">
      <View className="mr-1 flex-1">
        <ControlledInput
          control={control}
          name={names[0]}
          label={labels[0]}
          error={errors[names[0]]?.message}
        />
      </View>
      <View className="mx-2 bg-white"></View>
      <View className="ml-1 flex-1">
        <ControlledInput
          control={control}
          name={names[1]}
          label={labels[1]}
          error={errors[names[1]]?.message}
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
        name="diklat"
        label="Diklat"
        error={errors.diklat?.message}
      />

      <ControlledInput
        control={control}
        name="tempat"
        label="Tempat"
        error={errors.tempat?.message}
      />

      <ControlledInput
        control={control}
        name="penyelenggara"
        label="Penyelenggara"
        error={errors.penyelenggara?.message}
      />

      <DateInputGroup
        control={control}
        errors={errors}
        names={['tanggal_mulai', 'tanggal_akhir']}
        labels={['Tanggal Mulai', 'Tanggal Akhir']}
      />

      <DateInputGroup
        control={control}
        errors={errors}
        names={['jumlah_jam', 'nomor_sertifikat']}
        labels={['Jumlah Jam', 'Nomor Sertifikat']}
      />

      <DateInputGroup
        control={control}
        errors={errors}
        names={['tanggal_sertifikat', 'angkatan']}
        labels={['Tanggal Sertifikat', 'Angkatan']}
      />
    </>
  );
}

const FormDiklatTeknis = forwardRef<
  { submit: () => Promise<boolean> },
  DiklatTeknisFormProps
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
      <Text className="mb-4 text-xl font-bold text-[#0B3880]">
        Diklat Teknis
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

export { FormDiklatTeknis };
