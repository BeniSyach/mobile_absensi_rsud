import { Stack } from 'expo-router';
import { ImageBackground, StatusBar } from 'react-native';

import CardDataPegawaiComponent from '@/components/ekin-component/data-pegawai-component/card-data-pegawai';
import LogoTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/logo-tambah-kegiatan';
import NavbarTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/navbar-tambah-kegiatan';
import { SafeAreaView } from '@/components/ui';

export default function PegawaiEkin() {
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
          <LogoTambahKegiatan />
        </ImageBackground>
        <CardDataPegawaiComponent />
      </ImageBackground>
    </SafeAreaView>
  );
}
