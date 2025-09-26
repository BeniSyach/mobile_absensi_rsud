import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Title } from '@/components/title';

export default function ListCuti() {
  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
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
