import { Stack, useFocusEffect } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import {
  GetUser,
  PostAbsenMasuk,
  PostAbsenPulang,
  useGetLocationDetail,
} from '@/api';
import {
  AbsensiForm,
  type AbsensiFormProps,
} from '@/components/absensi/absensi-form';
import { Button, showErrorMessage, View } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

import useAbsensiSubmit from './use-absensi-submit';

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
  const storedMessage = getMessage();
  const router = useRouter();
  const {
    data: location,
    isLoading,
    isError,
    refetch: ceklokasi,
  } = useGetLocationDetail({
    variables: { id: storedMessage?.opd_id ?? 2 },
    enabled: !!storedMessage?.opd_id,
  });

  const { data: user, refetch } = GetUser({
    variables: storedMessage?.id,
    enabled: !!storedMessage?.id,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (storedMessage?.id) {
        refetch();
        ceklokasi(); // Memanggil ulang refetch setiap kali halaman fokus
      }
    }, [storedMessage?.id, refetch, ceklokasi]) // Pastikan hanya dipanggil jika id berubah
  );

  const { mutate: addPost, isPending: isAddingMasuk } = PostAbsenMasuk();
  const { mutate: addPostPulang, isPending: isAddingPulang } =
    PostAbsenPulang();
  const submitAbsensi = useAbsensiSubmit(addPost, addPostPulang);

  const [loading, setLoading] = useState(false);

  const onSubmit: AbsensiFormProps['onSubmit'] = async (data) => {
    setLoading(true);
    try {
      await submitAbsensi(data);
      showMessage({
        message: 'Absensi berhasil dilakukan!',
        type: 'success',
      });
      router.back();
    } catch (error: any) {
      showErrorMessage(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError || !user || !location) return <ErrorState />;

  return (
    <>
      <Stack.Screen
        options={{ title: 'Absensi', headerBackTitle: 'Absensi' }}
      />
      <AbsensiForm
        // control={control}
        isPending={loading || isAddingMasuk || isAddingPulang}
        onSubmit={onSubmit}
        location={location}
        user={user}
      />
    </>
  );
}
