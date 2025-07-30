import { Stack } from 'expo-router';
import { ImageBackground, StatusBar } from 'react-native';

import { UseProfileEkin } from '@/api';
import CardDataPegawaiComponent from '@/components/ekin-component/data-pegawai-component/card-data-pegawai';
import LogoDataPegawai from '@/components/ekin-component/data-pegawai-component/logo-data-pegawai';
import NavbarTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/navbar-tambah-kegiatan';
import { SafeAreaView, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function PegawaiEkin() {
  const storedMessage = getMessage();
  const { data: dataProfile, error } = UseProfileEkin();

  if (error) {
    return (
      <Text className="text-red-500">
        Terjadi kesalahan:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </Text>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Profile Pegawai ekin',
          headerBackTitle: 'Profile Pegawai ekin',
          headerShown: false,
        }}
      />

      <ImageBackground
        source={require('../../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../../assets/image/header_background_ekin.png')}
          resizeMode="cover"
          className="h-[19%] w-full"
        >
          <NavbarTambahKegiatan />
          <LogoDataPegawai />
        </ImageBackground>
        <CardDataPegawaiComponent
          data={storedMessage}
          dataProfileEkin={dataProfile}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
