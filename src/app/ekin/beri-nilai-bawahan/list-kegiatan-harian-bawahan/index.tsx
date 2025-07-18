/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { type Tagihan } from '@/api/bapenda';
import DiterimaComponent from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/diterima-component';
import DitolakComponent from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/ditolak-component';
import LogoKegiatanHarianBawahan from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/logo-kegiatan-harian-bawahan';
import PendingComponent from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/pending-component';
import PilihanKegiatan from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/pilihan-kegiatan';
import NavbarNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/navbar-nilai-bawahan';
import { SafeAreaView } from '@/components/ui';

type TabType = 'pending' | 'disetujui' | 'ditolak';

export default function ListKegiatanHarianBawahan() {
  const [dataTagihan, setDataTagihan] = useState<Tagihan[]>([]);
  const [Pending, setPending] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>('pending');
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
        source={require('../../../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../../../assets/image/header_background_ekin.png')}
          resizeMode="cover"
          className="h-40 w-full"
        >
          <NavbarNilaiBawahan />
          <LogoKegiatanHarianBawahan />
        </ImageBackground>
        <PilihanKegiatan
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {selectedTab === 'pending' && (
          <PendingComponent dataTagihan={dataTagihan} Pending={Pending} />
        )}
        {selectedTab === 'disetujui' && (
          <DiterimaComponent dataTagihan={dataTagihan} Pending={Pending} />
        )}
        {selectedTab === 'ditolak' && (
          <DitolakComponent dataTagihan={dataTagihan} Pending={Pending} />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}
