import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import LogoListKegiatan from '@/components/ekin-component/list-kegiatan-component/logo-list-kegiatan';
import NavbarListKegiatan from '@/components/ekin-component/list-kegiatan-component/navbar-list-kegiatan';
import { SafeAreaView } from '@/components/ui';

export default function ListKegiatan() {
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
        <NavbarListKegiatan />
        <LogoListKegiatan />
      </ImageBackground>
    </SafeAreaView>
  );
}
