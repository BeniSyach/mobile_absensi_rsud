import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';

import { type Tagihan } from '@/api/bapenda';
import FormHasilKerja from '@/components/ekin-component/rencana-hasil-kerja-component/form-hasil-kerja';
import ListHasilKerjaComponent from '@/components/ekin-component/rencana-hasil-kerja-component/list-hasil-kerja';
import LogoHasilKerja from '@/components/ekin-component/rencana-hasil-kerja-component/logo-hasil-kerja';
import NavbarHasilKerjaComponent from '@/components/ekin-component/rencana-hasil-kerja-component/navbar-hasil-kerja-component';
import { Button, SafeAreaView } from '@/components/ui';

export default function RencanaHasilKinerja() {
  const router = useRouter();
  const [dataTagihan, setDataTagihan] = useState<Tagihan[]>([]);
  const [Pending, setPending] = useState(false);
  useEffect(() => {
    setPending(true);
    setDataTagihan([
      {
        STATUS: '1',
        J_TEMPO: 'Kegiatan 1',
        THN_PAJAK_SPPT: '2021-01-01',
        POKOK: '100000',
        DENDA: 10000,
        TOTAL: 110000,
      },
    ]);
    setPending(false);
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'List Kegiatan ekin',
          headerBackTitle: 'List Kegiatan ekin',
          headerShown: false,
        }}
      />

      <ImageBackground
        source={require('../../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../../assets/image/header_background_ekin.png')}
          resizeMode="cover"
          className="h-[19%] w-full"
        >
          <NavbarHasilKerjaComponent />
          <LogoHasilKerja />
        </ImageBackground>
        <FormHasilKerja />
        <ListHasilKerjaComponent dataTagihan={dataTagihan} Pending={Pending} />
        <View className="flex-row justify-center px-5 py-2">
          <Button
            label="Tambah Rencana hasil Kerja"
            onPress={() => router.push('/ekin/rencana-hasil-kerja/post-rhk')}
            variant="outline"
            className="m-5 rounded-xl bg-[#287BDC] font-bold text-white"
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
