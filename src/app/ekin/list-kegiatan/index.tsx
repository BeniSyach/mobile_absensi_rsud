import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { type Tagihan } from '@/api/bapenda';
import FormListKegiatan from '@/components/ekin-component/list-kegiatan-component/form-list-kegiatan';
import ListKegiatanComponent from '@/components/ekin-component/list-kegiatan-component/list-kegiatan-compoent';
import LogoListKegiatan from '@/components/ekin-component/list-kegiatan-component/logo-list-kegiatan';
import NavbarListKegiatan from '@/components/ekin-component/list-kegiatan-component/navbar-list-kegiatan';
import { SafeAreaView } from '@/components/ui';

export default function ListKegiatan() {
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
      {
        STATUS: '1',
        J_TEMPO: 'Kegiatan 1',
        THN_PAJAK_SPPT: '2021-01-01',
        POKOK: '100000',
        DENDA: 10000,
        TOTAL: 110000,
      },
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
          className="h-40 w-full"
        >
          <NavbarListKegiatan />
          <LogoListKegiatan />
        </ImageBackground>
        <FormListKegiatan />
        <ListKegiatanComponent dataTagihan={dataTagihan} Pending={Pending} />
      </ImageBackground>
    </SafeAreaView>
  );
}
