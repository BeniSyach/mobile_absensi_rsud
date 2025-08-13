import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import FormTambahKegiatanPejabat from '@/components/ekin-component/tambah-kegiatan-pejabat-component/form-tambah-pejabat-kegiatan';
import LogoTambahKegiatanPejabat from '@/components/ekin-component/tambah-kegiatan-pejabat-component/logo-tambah-pejabat-kegiatan';
import NavbarTambahKegiatanPejabat from '@/components/ekin-component/tambah-kegiatan-pejabat-component/navbar-tambah-kegiatan-pejabat';
import { SafeAreaView } from '@/components/ui';
import { getMessage } from '@/lib';

export default function TambahKegiatanPejabat() {
  const storedMessage = getMessage();
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Home ekin',
          headerBackTitle: 'Home ekin',
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
          <NavbarTambahKegiatanPejabat />
          <LogoTambahKegiatanPejabat />
        </ImageBackground>
        <FormTambahKegiatanPejabat dataUserLogin={storedMessage} />
      </ImageBackground>
    </SafeAreaView>
  );
}
