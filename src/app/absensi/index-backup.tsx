import { Stack, useFocusEffect } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { PostAbsenMasuk, PostAbsenPulang, useFaceRecognition } from '@/api';
import {
  AbsensiForm,
  type AbsensiFormProps,
} from '@/components/absensi/absensi-form';
import { Button, SafeAreaView, showErrorMessage, View } from '@/components/ui';
import { getMessage } from '@/lib';

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

// eslint-disable-next-line max-lines-per-function
export default function Absensi() {
  const router = useRouter();
  const storedMessage = getMessage();
  const { user, isError, isLoading, userStatus, getStatusDataAbsenUser } =
    useAbsensiData();
  const [submitLoading, setSubmitLoading] = useState(false);
  const {
    data: wajah,
    isLoading: loadingWajah,
    isError: errorWajah,
  } = useFaceRecognition({ variables: { nik: storedMessage?.nik ?? '' } });
  const { mutateAsync: addPost, isPending: isAddingMasuk } = PostAbsenMasuk();
  const { mutateAsync: addPostPulang, isPending: isAddingPulang } =
    PostAbsenPulang();
  const submitAbsensi = useAbsensiSubmit(addPost, addPostPulang);
  useFocusEffect(
    useCallback(() => {
      getStatusDataAbsenUser();
    }, [])
  );
  const onSubmit: AbsensiFormProps['onSubmit'] = async (data) => {
    setSubmitLoading(true);
    try {
      const response = await submitAbsensi(data);
      console.log(response);
      if (response?.error) {
        showErrorMessage(response.error);
        return;
      }

      showMessage({
        message: 'Absensi berhasil dilakukan!',
        type: 'success',
        duration: 7000,
      });
      router.back();
    } catch (error: any) {
      console.log(error);
      showErrorMessage(
        error?.response?.data?.error || error?.message || 'Terjadi kesalahan'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading || loadingWajah) return <LoadingState />;
  if (isError || !user || errorWajah) return <ErrorState />;

  if (!user.data.shift_absen_id) {
    Alert.alert('Peringatan', 'Shift belum diatur. Silakan hubungi admin.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  if (wajah?.status === 0) {
    Alert.alert('Peringatan', wajah.message, [
      {
        text: 'Pindah Ke menu Profile',
        onPress: () => {
          setTimeout(() => {
            router.replace('/settings');
          }, 100);
        },
      },
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
      <StatusBar backgroundColor="#0B3880" barStyle="dark-content" />

      <AbsensiForm
        isPending={submitLoading || isAddingMasuk || isAddingPulang}
        onSubmit={onSubmit}
        user={user}
        userStatus={userStatus?.lastAbsenStatus}
      />
    </SafeAreaView>
  );
}
