import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddPangkatGolongan from '@/components/simpegComponent/pangkat-golongan-component/add-pangkat-golongan';
import CardGolongan from '@/components/simpegComponent/pangkat-golongan-component/card-golongan';

export default function PangkatGolongan() {
  return (
    <SafeAreaView
      className="flex-1 bg-[#0B3880]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#CBDFFF" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Pangkat & Golongan Simpeg',
          headerBackTitle: 'Pangkat & Golongan Simpeg',
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
          sourceImage={require('../../../../assets/image/pangkat_golongan_2.png')}
          judul="PANGKAT & GOLONGAN"
        />
        <ScrollView>
          <CardGolongan />
          <AddPangkatGolongan />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
