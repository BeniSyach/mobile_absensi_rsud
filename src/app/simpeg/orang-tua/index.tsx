import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import { GetOrangTua } from '@/api/simpeg/orang-tua';
import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddOrangTua from '@/components/simpegComponent/orang-tua-component/add-orang-tua';
import CardOrangTua from '@/components/simpegComponent/orang-tua-component/card-orang-tua';

export default function OrangTua() {
  const { data: orangTua, isLoading: isLoadingOrangTua } = GetOrangTua();
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Orang Tua Simpeg',
          headerBackTitle: 'Orang Tua Simpeg',
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
          sourceImage={require('../../../../assets/image/orang_tua_2.png')}
          judul="Orang Tua"
        />
        <AddOrangTua />
        <CardOrangTua
          data={orangTua?.data?.data ?? []}
          isLoading={isLoadingOrangTua}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
