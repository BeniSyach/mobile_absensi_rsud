import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground } from 'react-native';
import { StatusBar } from 'react-native';

import { GetUser } from '@/api';
import { GetCpns } from '@/api/simpeg/cpns';
import { GetPns } from '@/api/simpeg/pns';
import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import CardDataCpns from '@/components/simpegComponent/cpns-pns-component/card-data-cpns';
import CardDataPns from '@/components/simpegComponent/cpns-pns-component/card-data-pns';
import { SafeAreaView, ScrollView, Text } from '@/components/ui';
import LoadingComponent from '@/components/ui/loading';

export default function CpnsPns() {
  const { data: user, isLoading, isError } = GetUser();
  const {
    data: dataCpns,
    isLoading: loadingCpns,
    isError: errorCpns,
  } = GetCpns();
  const { data: dataPns, isLoading: loadingPns, isError: errorPns } = GetPns();
  if (isLoading) return <LoadingComponent />;
  if (isError || !user) return <Text>Error loading user data</Text>;
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#CBDFFF" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'CPNS & PNS Simpeg',
          headerBackTitle: 'CPNS & PNS Simpeg',
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
          sourceImage={require('../../../../assets/image/secure_data.png')}
          judul="DATA CPNS & PNS"
        />
        <ScrollView className=" flex-1">
          <CardDataCpns
            data={dataCpns}
            loading={loadingCpns}
            error={errorCpns}
          />
          <CardDataPns data={dataPns} loading={loadingPns} error={errorPns} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
