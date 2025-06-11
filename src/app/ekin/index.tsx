import { Stack, useFocusEffect } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';

import { GetUser } from '@/api';
import MenuKegiatanHarianBawahan from '@/components/ekin-component/menu-kegiatan-harian-bawahan';
import MenuKegiatanHarianSaya from '@/components/ekin-component/menu-kegiatan-harian-saya';
import MenuUtama from '@/components/ekin-component/menu-utama';
import NavbarEkin from '@/components/ekin-component/navbar-ekin';
import { SafeAreaView } from '@/components/ui';
import LoadingComponent from '@/components/ui/loading';
import { getMessage } from '@/lib';

export default function Ekin() {
  const storedMessage = getMessage();
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = GetUser({
    variables: storedMessage?.id,
    enabled: !!storedMessage?.id,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (storedMessage?.id) {
        refetch();
      }
    }, [storedMessage?.id, refetch]) // Pastikan hanya dipanggil jika id berubah
  );

  if (isLoading) return <LoadingComponent />;
  if (isError || !user) return <Text>Error loading user data</Text>;
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Home ekin',
          headerBackTitle: 'Home ekin',
          headerShown: false,
        }}
      />

      <ImageBackground
        source={require('../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <NavbarEkin />
        <View className="px-4">
          <Text className="mt-3 text-lg font-bold text-blue-500">
            Hallo, {user.name}
          </Text>
          <Text className="text-sm font-bold text-blue-500">Instansi : </Text>
        </View>
        <ScrollView className="flex-1">
          <MenuKegiatanHarianSaya />
          <MenuKegiatanHarianBawahan />
          <MenuUtama />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
