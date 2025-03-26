import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { GetPendidikan } from '@/api/simpeg/pendidikan';
import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddPendidikan from '@/components/simpegComponent/pendidikan-component/add-pendidikan';
import CardPendidikan from '@/components/simpegComponent/pendidikan-component/card-pendidikan';
import { SafeAreaView } from '@/components/ui';

export default function Pendidikan() {
  const { data: pendidikan, isLoading: isLoadingPendidikan } = GetPendidikan();
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Pendidikan Simpeg',
          headerBackTitle: 'Pendidikan Simpeg',
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
          sourceImage={require('../../../../assets/image/pendidikan_2.png')}
          judul="PENDIDIKAN"
        />
        <AddPendidikan />
        <CardPendidikan
          data={pendidikan?.data?.data ?? []}
          isLoading={isLoadingPendidikan}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
