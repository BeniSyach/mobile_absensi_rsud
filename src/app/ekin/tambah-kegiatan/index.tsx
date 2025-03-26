import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import FormTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/form-tambah-kegiatan';
import LogoTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/logo-tambah-kegiatan';
import NavbarTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/navbar-tambah-kegiatan';
import { SafeAreaView } from '@/components/ui';

export default function TambahKegiatan() {
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="light-content" />
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
        <NavbarTambahKegiatan />
        <LogoTambahKegiatan />
        <FormTambahKegiatan />
      </ImageBackground>
    </SafeAreaView>
  );
}
