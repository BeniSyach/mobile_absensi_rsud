import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddBerkasPak from '@/components/simpegComponent/berkas-pak-component/add-berkas-pak';
import { SafeAreaView } from '@/components/ui';

export default function BerkasPak() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="light-content" />
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
          sourceImage={require('../../../../assets/image/berkas_pendukung_2.png')}
          judul="BERKAS PAK"
        />
        <AddBerkasPak />
      </ImageBackground>
    </SafeAreaView>
  );
}
