import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, RefreshControl } from 'react-native';
import * as z from 'zod';

import { Button, ScrollView, Text, View } from '@/components/ui';

import { FormFields } from './form-fields';

const schema = z.object({
  name: z.string({
    required_error: 'Nama is required',
  }),
  nip: z.string({
    required_error: 'nip is required',
  }),
  nik: z.string({
    required_error: 'NIK is required',
  }),
  id_divisi: z.string({
    required_error: 'Devisi is required',
  }),
  id_gender: z.string({
    required_error: 'Gender is required',
  }),
  id_status: z.string({
    required_error: 'Status is required',
  }),
});

export type FormEditUserProps = {
  onSubmit?: SubmitHandler<FormType>;
  isPending?: boolean;
  isError?: boolean;
  defaultValues?: FormType;
};

export type FormType = z.infer<typeof schema>;

export default function FormEditUser({
  onSubmit = () => {},
  isPending,
  defaultValues,
}: FormEditUserProps) {
  const [refreshing, setRefreshing] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 1000);
          }}
        />
      }
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <View className="m-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-600 dark:bg-gray-800">
          <View className="flex-1 justify-center p-4">
            <View className="items-center justify-center">
              <Text className="pb-6 text-center text-2xl font-bold text-blue-500">
                Edit Data User
              </Text>
            </View>
            <FormFields control={control} errors={errors} setValue={setValue} />
            <Button
              testID="edit-user-button"
              label="Edit Data"
              loading={isPending}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
