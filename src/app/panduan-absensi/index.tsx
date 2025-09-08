import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { Title } from '@/components/title';
import { SafeAreaView } from '@/components/ui';

export default function PanduanAbsensi() {
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: 'Daftar Panduan Absensi',
          headerBackTitle: 'Daftar Panduan Absensi',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <Title text="Daftar Panduan Absensi" textColor="#20A0D8" />
      </ImageBackground>
    </SafeAreaView>
  );
}
