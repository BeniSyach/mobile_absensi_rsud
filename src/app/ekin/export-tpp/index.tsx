import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import LogoExportTPP from '@/components/ekin-component/export-tpp/logo-export-tpp';
import NavbarExportTPP from '@/components/ekin-component/export-tpp/navbar-export-tpp';
import { SafeAreaView } from '@/components/ui';

export default function ExportTpp() {
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
        <NavbarExportTPP />
        <LogoExportTPP />
      </ImageBackground>
    </SafeAreaView>
  );
}
