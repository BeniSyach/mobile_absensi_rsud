import { Stack } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

import { GetDashboardPegawai, GetDashboardPegawaiBawahan } from '@/api';
import MenuKegiatanHarianBawahan from '@/components/ekin-component/menu-kegiatan-harian-bawahan';
import MenuKegiatanHarianSaya from '@/components/ekin-component/menu-kegiatan-harian-saya';
import MenuUtama from '@/components/ekin-component/menu-utama';
import NavbarEkin from '@/components/ekin-component/navbar-ekin';
import { getMessage } from '@/lib';

export default function Ekin() {
  const storedMessage = getMessage();
  const {
    data: dashboardPegawai,
    isPending: pendingDashboardPegawai,
    isError: errorDashboardPegawai,
  } = GetDashboardPegawai();
  const {
    data: dashboardPegawaiBawahan,
    isPending: pendingBawahan,
    isError: errorBawahan,
  } = GetDashboardPegawaiBawahan();

  const { width, height } = Dimensions.get('window');

  // responsive ukuran berdasarkan dimensi layar
  const navbarHeight = height * 0.19; // 18% dari layar
  const horizontalPadding = width > 600 ? 32 : 16;

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
        source={require('../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        style={{ flex: 1, width, height }}
      >
        {/* Navbar dengan tinggi responsif */}
        <View style={{ height: navbarHeight }}>
          <NavbarEkin data={storedMessage} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: horizontalPadding,
            paddingBottom: height * 0.06, // padding bawah 5% dari layar
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 space-y-4">
            <MenuKegiatanHarianSaya
              data={dashboardPegawai}
              isPending={pendingDashboardPegawai}
              isError={errorDashboardPegawai}
            />
            <MenuKegiatanHarianBawahan
              data={dashboardPegawaiBawahan}
              isPending={pendingBawahan}
              isError={errorBawahan}
            />
            <MenuUtama data={storedMessage} />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
