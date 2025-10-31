/* eslint-disable max-lines-per-function */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type DetailKegiatan, useGetListDetailKegiatanInfinite } from '@/api';
import DiterimaComponent from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/diterima-component';
import DitolakComponent from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/ditolak-component';
import LogoKegiatanHarianBawahan from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/logo-kegiatan-harian-bawahan';
import PendingComponent from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/pending-component';
import PilihanKegiatan from '@/components/ekin-component/beri-nilai-bawahan/list-kegiatan-harian-bawahan-compoenet/pilihan-kegiatan';
import NavbarNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/navbar-nilai-bawahan';
import { Text } from '@/components/ui';

type TabType = 'pending' | 'disetujui' | 'ditolak';

export default function ListKegiatanHarianBawahan() {
  const { nik } = useLocalSearchParams<{ nik: string }>();
  const [status, setStatus] = useState('0');
  const [selectedTab, setSelectedTab] = useState<TabType>('pending');

  const page = 1;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useGetListDetailKegiatanInfinite({
    nik,
    page,
    limit: 30,
    status,
  });

  const dataListKegiatanBawahan: DetailKegiatan[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <Text className="text-red-500">
        Terjadi kesalahan:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </Text>
    );
  }
  return (
    <SafeAreaView
      className="flex-1 bg-[#287BDC]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
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
          className="h-[19%] w-full"
        >
          <NavbarNilaiBawahan />
          <LogoKegiatanHarianBawahan />
        </ImageBackground>
        <PilihanKegiatan
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setStatus={setStatus}
        />
        {selectedTab === 'pending' && (
          <PendingComponent
            dataPending={dataListKegiatanBawahan}
            Pending={isLoading || isFetchingNextPage}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage ?? false}
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        )}
        {selectedTab === 'disetujui' && (
          <DiterimaComponent
            dataDisetujui={dataListKegiatanBawahan}
            Pending={isLoading || isFetchingNextPage}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage ?? false}
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        )}
        {selectedTab === 'ditolak' && (
          <DitolakComponent
            dataDitolak={dataListKegiatanBawahan}
            Pending={isLoading || isFetchingNextPage}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage ?? false}
            onRefresh={handleRefresh}
            refreshing={isRefetching}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}
