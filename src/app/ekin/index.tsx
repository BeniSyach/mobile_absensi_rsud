import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StatusBar } from 'react-native';

import { GetDashboardPegawai, GetDashboardPegawaiBawahan } from '@/api';
import MenuKegiatanHarianBawahan from '@/components/ekin-component/menu-kegiatan-harian-bawahan';
import MenuKegiatanHarianSaya from '@/components/ekin-component/menu-kegiatan-harian-saya';
import MenuUtama from '@/components/ekin-component/menu-utama';
import NavbarEkin from '@/components/ekin-component/navbar-ekin';
import { SafeAreaView } from '@/components/ui';
import { getMessage } from '@/lib';

export default function Ekin() {
  const storedMessage = getMessage();
  const { data: dashboardPegawai } = GetDashboardPegawai();
  const { data: dashboardPegawaiBawahan } = GetDashboardPegawaiBawahan();
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
        source={require('../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <NavbarEkin data={storedMessage} />
        <ScrollView className="z-0 flex-1">
          <MenuKegiatanHarianSaya data={dashboardPegawai} />
          <MenuKegiatanHarianBawahan data={dashboardPegawaiBawahan} />
          <MenuUtama />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
