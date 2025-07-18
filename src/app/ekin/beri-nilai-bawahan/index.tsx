import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { type Tagihan } from '@/api/bapenda';
import FormNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/form-nilai-bawahan';
import ListNilaiBawahanComponent from '@/components/ekin-component/beri-nilai-bawahan/list-nilai-bawahan';
import LogoNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/logo-nilai-bawahan';
import NavbarNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/navbar-nilai-bawahan';
import { SafeAreaView } from '@/components/ui';

export default function BeriNilaiBawahan() {
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
          <NavbarNilaiBawahan />
          <LogoNilaiBawahan />
        </ImageBackground>
        <FormNilaiBawahan />
        <ListNilaiBawahanComponent
          dataTagihan={dataTagihan}
          Pending={Pending}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
