import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';

import { PostAbsenMasuk, PostAbsenPulang, useGetLocationDetail } from '@/api';
import {
  AbsensiForm,
  type FormType,
  schema,
} from '@/components/absensi/absensi-form';
import { View } from '@/components/ui';
import { Button } from '@/components/ui';

import { useAbsensiSubmit } from './use-absensi-submit';

const LoadingState = () => (
  <View className="flex-1 items-center justify-center">
    <Stack.Screen options={{ title: 'Absensi', headerBackTitle: 'Absensi' }} />
    <Button label="Loading..." disabled />
  </View>
);

const ErrorState = () => (
  <View className="flex-1 items-center justify-center">
    <Stack.Screen options={{ title: 'Absensi', headerBackTitle: 'Absensi' }} />
    <Button label="Error fetching location" disabled />
  </View>
);

export default function Absensi() {
  const {
    data: location,
    isLoading,
    isError,
  } = useGetLocationDetail({ variables: { id: 2 } });
  const { handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { mutate: addPost, isPending } = PostAbsenMasuk();
  const { mutate: addPostPulang } = PostAbsenPulang();

  const onSubmit = useAbsensiSubmit(addPost, addPostPulang);

  if (isLoading) return <LoadingState />;
  if (isError || !location) return <ErrorState />;

  return (
    <>
      <Stack.Screen
        options={{ title: 'Absensi', headerBackTitle: 'Absensi' }}
      />
      <AbsensiForm
        // control={control}
        isPending={isPending}
        onSubmit={handleSubmit(onSubmit)}
        location={location}
      />
    </>
  );
}
