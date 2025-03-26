import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { PostAbsenMasuk, PostAbsenPulang } from '@/api';
import {
  AbsensiForm,
  type AbsensiFormProps,
} from '@/components/absensi/absensi-form';
import { Button, SafeAreaView, showErrorMessage, View } from '@/components/ui';

import useAbsensiData from './use-absensi-data';
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
  const router = useRouter();
  const { user, isError, isLoading, userStatus } = useAbsensiData();
  const [submitLoading, setSubmitLoading] = useState(false);

  const { mutate: addPost, isPending: isAddingMasuk } = PostAbsenMasuk();
  const { mutate: addPostPulang, isPending: isAddingPulang } =
    PostAbsenPulang();
  const submitAbsensi = useAbsensiSubmit(addPost, addPostPulang);

  const onSubmit: AbsensiFormProps['onSubmit'] = async (data) => {
    setSubmitLoading(true);
    try {
      await submitAbsensi(data);
      showMessage({
        message: 'Absensi berhasil dilakukan!',
        type: 'success',
        duration: 7000,
      });
      router.back();
    } catch (error: any) {
      showErrorMessage(error.response?.data?.error || error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError || !user) return <ErrorState />;

  if (!user.data.shift_absen_id) {
    Alert.alert('Peringatan', 'Shift belum diatur. Silakan hubungi admin.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <Stack.Screen
        options={{
          title: 'Absensi',
          headerBackTitle: 'Absensi',
        }}
      />
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />

      <AbsensiForm
        isPending={submitLoading || isAddingMasuk || isAddingPulang}
        onSubmit={onSubmit}
        user={user}
        userStatus={userStatus?.data.data.lastAbsenStatus}
      />
    </SafeAreaView>
  );
}
