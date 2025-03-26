import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { GetKeluarga } from '@/api/simpeg/keluarga';
import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddKeluarga from '@/components/simpegComponent/keluarga-component/add-keluarga';
import CardKeluarga from '@/components/simpegComponent/keluarga-component/card-keluarga';
import { SafeAreaView } from '@/components/ui';

export default function Keluarga() {
  const { data: keluarga, isLoading: isLoadingKeluarga } = GetKeluarga();
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Keluarga Simpeg',
          headerBackTitle: 'Keluarga Simpeg',
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
          sourceImage={require('../../../../assets/image/keluarga_2.png')}
          judul="KELUARGA"
        />
        <AddKeluarga />
        <CardKeluarga
          data={keluarga?.data?.data ?? []}
          isLoading={isLoadingKeluarga}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
