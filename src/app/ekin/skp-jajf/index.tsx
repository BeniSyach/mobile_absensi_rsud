import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import LogoSKPJajf from '@/components/ekin-component/skp-jajf-component/logo-skp-jajf';
import NavbarSKPJAJF from '@/components/ekin-component/skp-jajf-component/navbar-skp-jajf';
import { SafeAreaView } from '@/components/ui';

export default function SkpJajf() {
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
        <NavbarSKPJAJF />
        <LogoSKPJajf />
      </ImageBackground>
    </SafeAreaView>
  );
}
