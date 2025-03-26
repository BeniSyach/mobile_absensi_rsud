import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import LogoSKPJA from '@/components/ekin-component/skp-ja-component/logo-skp-js';
import NavbarSKPJA from '@/components/ekin-component/skp-ja-component/navbar-skp-ja';
import { SafeAreaView } from '@/components/ui';

export default function SkpJa() {
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
        <NavbarSKPJA />
        <LogoSKPJA />
      </ImageBackground>
    </SafeAreaView>
  );
}
