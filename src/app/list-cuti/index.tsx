import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import { Title } from '@/components/title';

export default function ListCuti() {
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: 'Daftar Cuti Bawahan',
          headerBackTitle: 'Daftar Cuti Bawahan',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <Title text="Daftar Cuti Bawahan" textColor="#20A0D8" />
      </ImageBackground>
    </SafeAreaView>
  );
}
