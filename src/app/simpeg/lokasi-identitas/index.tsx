import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { GetUser } from '@/api';
import BackSimpeg from '@/components/back-simpeg';
import CardDataIdentitas from '@/components/simpegComponent/lokasi-identitas-component/card-data-identitas';
import CardLokasiUnit from '@/components/simpegComponent/lokasi-identitas-component/card-lokasi-unit';
import MenuLokasiIdentitas from '@/components/simpegComponent/lokasi-identitas-component/menu-lokasi-identitas';
import { SafeAreaView, ScrollView, Text } from '@/components/ui';
import LoadingComponent from '@/components/ui/loading';

export default function LokasiIdentitas() {
  const { data: user, isLoading, isError } = GetUser();
  if (isLoading) return <LoadingComponent />;
  if (isError || !user) return <Text>Error loading user data</Text>;
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Lokasi & Identitas Simpeg',
          headerBackTitle: 'Lokasi & Identitas Simpeg',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/background/background_2.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <BackSimpeg />
        <MenuLokasiIdentitas data={user} />
        <ScrollView className=" flex-1">
          <CardDataIdentitas message={user} />
          <CardLokasiUnit message={user} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
