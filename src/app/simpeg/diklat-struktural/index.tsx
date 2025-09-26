import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddDiklatStruktural from '@/components/simpegComponent/diklat-struktural-component/add-diklat-struktural';

export default function DiklatStruktural() {
  return (
    <SafeAreaView
      className="flex-1 bg-[#0B3880]"
      edges={['top', 'left', 'right']}
    >
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
          sourceImage={require('../../../../assets/image/diklat_struktural_2.png')}
          judul="DIKLAT STRUKTURAL"
        />
        <AddDiklatStruktural />
      </ImageBackground>
    </SafeAreaView>
  );
}
