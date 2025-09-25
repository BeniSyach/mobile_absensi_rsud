import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddDiklatTeknis from '@/components/simpegComponent/diklat-teknis-component/add-diklat-teknis';

export default function DiklatTeknis() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Diklat Teknis Simpeg',
          headerBackTitle: 'Diklat Teknis Simpeg',
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
          sourceImage={require('../../../../assets/image/diklat_teknis_2.png')}
          judul="DIKLAT TEKNIS"
        />
        <AddDiklatTeknis />
      </ImageBackground>
    </SafeAreaView>
  );
}
