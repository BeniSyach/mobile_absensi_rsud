import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddKegiatanHarian from '@/components/simpegComponent/kegiatan_harian-component/add-kegiatan-harian';
import { SafeAreaView } from '@/components/ui';

export default function KegiatanHarian() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Diklat Struktural Simpeg',
          headerBackTitle: 'Diklat Struktural Simpeg',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/background/background_2.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <BackSimpeg />
        <HeaderSimpeg
          sourceImage={require('../../../../assets/image/kegiatan_harian_2.png')}
          judul="BERKAS KEGIATAN"
        />
        <AddKegiatanHarian />
      </ImageBackground>
    </SafeAreaView>
  );
}
