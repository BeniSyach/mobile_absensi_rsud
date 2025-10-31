import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, StatusBar, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostAbsenMasuk, PostAbsenPulang, queryClient } from '@/api';
import {
  AbsensiForm,
  type AbsensiFormProps,
} from '@/components/absensi/absensi-form';
import { Button, showErrorMessage } from '@/components/ui';

import useAbsensiData from './use-absensi-data';
import useAbsensiSubmit from './use-absensi-submit';

type ErrorStateProps = {
  message?: string;
};

const LoadingState = () => (
  <View className="flex-1 items-center justify-center">
    <Stack.Screen
      options={{
        title: 'Absensi',
        headerBackTitle: 'Absensi',
        headerShown: false,
      }}
    />
    <StatusBar backgroundColor="#0B3880" barStyle="dark-content" />
    <Button label="Loading..." disabled />
  </View>
);

const ErrorState = ({ message }: ErrorStateProps) => (
  <View className="flex-1 items-center justify-center">
    <Stack.Screen
      options={{
        title: 'Absensi',
        headerBackTitle: 'Absensi',
        headerShown: false,
      }}
    />
    <StatusBar backgroundColor="#0B3880" barStyle="dark-content" />
    <Button label={message ?? 'Terjadi kesalahan'} disabled />
  </View>
);

// eslint-disable-next-line max-lines-per-function
export default function Absensi() {
  const router = useRouter();

  const { user, isError, isLoading, userStatus } = useAbsensiData();
  const [submitLoading, setSubmitLoading] = useState(false);

  const { mutateAsync: addPost, isPending: isAddingMasuk } = PostAbsenMasuk({
    onSuccess: (res) => {
      showMessage({
        message: res.message,
        type: 'success',
        duration: 7000,
      });
      router.back();
    },
    onError: (e) => {
      showErrorMessage(e.message);
    },
  });
  const { mutateAsync: addPostPulang, isPending: isAddingPulang } =
    PostAbsenPulang({
      onSuccess: (res) => {
        showMessage({
          message: res.message,
          type: 'success',
          duration: 7000,
        });
        router.back();
      },
      onError: (e) => {
        showErrorMessage(e.message);
      },
    });
  const submitAbsensi = useAbsensiSubmit(addPost, addPostPulang);
  // kalau ada cache, langsung pakai

  const onSubmit: AbsensiFormProps['onSubmit'] = async (data) => {
    setSubmitLoading(true);
    await submitAbsensi(data);

    const queries = [
      ['getAllAbsenMasukByUser'],
      ['getAllAbsenMasuk'],
      ['useRekapitulasiAbsenUser'],
      ['GetStatusAbsenUser'],
      ['getWaktuKerjaByShiftAndOPD'],
      ['getLocationDetail'],
      ['getShiftsByOpd'],
    ];

    queries.forEach((q) => {
      queryClient.invalidateQueries({ queryKey: q });
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError || !user) {
    return (
      <ErrorState
        message={
          isError
            ? 'Gagal memuat data absensi'
            : 'Gagal Mendapatkan Data Dari Server'
        }
      />
    );
  }

  if (!user.data.shift_absen_id) {
    Alert.alert('Peringatan', 'Shift belum diatur. Silakan hubungi admin.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Absensi',
          headerBackTitle: 'Absensi',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <AbsensiForm
          isPending={submitLoading || isAddingMasuk || isAddingPulang}
          onSubmit={onSubmit}
          user={user}
          userStatus={userStatus?.lastAbsenStatus}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
