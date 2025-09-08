import { Stack, useFocusEffect } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ImageBackground, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import {
  PostAbsenMasuk,
  PostAbsenPulang,
  queryClient,
  useFaceRecognition,
} from '@/api';
import {
  AbsensiForm,
  type AbsensiFormProps,
} from '@/components/absensi/absensi-form';
import { Button, SafeAreaView, showErrorMessage, View } from '@/components/ui';
import { getMessage } from '@/lib';

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
  const storedMessage = getMessage();
  const { user, isError, isLoading, userStatus, getStatusDataAbsenUser } =
    useAbsensiData();
  const [submitLoading, setSubmitLoading] = useState(false);
  const {
    data: wajah,
    isLoading: loadingWajah,
    // isError: errorWajah,
    refetch,
  } = useFaceRecognition({ variables: { nik: storedMessage?.nik ?? '' } });
  const { mutateAsync: addPost, isPending: isAddingMasuk } = PostAbsenMasuk();
  const { mutateAsync: addPostPulang, isPending: isAddingPulang } =
    PostAbsenPulang();
  const submitAbsensi = useAbsensiSubmit(addPost, addPostPulang);
  useFocusEffect(
    useCallback(() => {
      getStatusDataAbsenUser();
      refetch();
    }, [refetch, getStatusDataAbsenUser])
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
    <SafeAreaView className="flex-1">
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
