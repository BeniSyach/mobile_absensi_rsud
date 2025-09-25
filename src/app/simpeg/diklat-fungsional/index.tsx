import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddDiklatFungsional from '@/components/simpegComponent/diklat-fungsional-component/add-diklat-fungsional';

export default function DiklatFungsional() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Diklat Fungsional Simpeg',
          headerBackTitle: 'Diklat Fungsional Simpeg',
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
          sourceImage={require('../../../../assets/image/diklat_fungsional_2.png')}
          judul="DIKLAT FUNGSIONAL"
        />
        <AddDiklatFungsional />
      </ImageBackground>
    </SafeAreaView>
  );
}
