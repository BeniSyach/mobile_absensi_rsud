/* eslint-disable max-lines-per-function */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useListDetailKegiatan } from '@/api';
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
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]); // Optional: use KegiatanHarianItem[]
  const [hasNextPage, setHasNextPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [status, setStatus] = useState('0');
  const [selectedTab, setSelectedTab] = useState<TabType>('pending');
  const queryParams = {
    nik,
    page,
    limit: 30,
    status,
  };

  const {
    data: dataListDetailBawahan,
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
  } = useListDetailKegiatan({
    variables: queryParams,
  });

  const handleRefresh = async () => {
    setRefreshing(true);

    // Reset state untuk refresh
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
    setRefreshKey((prev) => prev + 1); // Force re-render

    try {
      // Tunggu refetch selesai
      await refetch();
    } catch (err) {
      console.error('Refresh error:', err);
    }

    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (dataListDetailBawahan) {
      // Coba berbagai kemungkinan struktur response
      let items = [];

      // Kemungkinan 1: data.data
      if (
        dataListDetailBawahan.data &&
        Array.isArray(dataListDetailBawahan.data)
      ) {
        items = dataListDetailBawahan.data;
      }
      // Kemungkinan 2: data saja (langsung array)
      else if (Array.isArray(dataListDetailBawahan)) {
        items = dataListDetailBawahan;
      }
      // Kemungkinan 3: data.items
      else if (
        dataListDetailBawahan.data &&
        Array.isArray(dataListDetailBawahan.data)
      ) {
        items = dataListDetailBawahan.data;
      }
      // Kemungkinan 4: data.result
      else if (
        dataListDetailBawahan.data &&
        Array.isArray(dataListDetailBawahan.data)
      ) {
        items = dataListDetailBawahan.data;
      } else {
        items = [];
      }

      if (items.length >= 0) {
        // Ubah dari > 0 ke >= 0 untuk handle empty array
        setAllItems((prevItems) => {
          // Jika sedang refresh (refreshing true), langsung replace
          if (refreshing && page === 1) {
            return items;
          }

          const newItems = page === 1 ? items : [...prevItems, ...items];

          return newItems;
        });

        // Update hasNextPage
        setHasNextPage(items.length >= 10);
      }
    }
  }, [dataListDetailBawahan, page, refreshing]); // Tambahkan refreshing ke dependency

  useEffect(() => {
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
    setRefreshKey((prev) => prev + 1);

    // Langsung refetch data baru
    refetch();
  }, [status]);

  if (isError) {
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
            dataPending={allItems}
            key={refreshKey}
            Pending={isLoading || isFetching}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}
        {selectedTab === 'disetujui' && (
          <DiterimaComponent
            key={refreshKey}
            dataDisetujui={allItems}
            Pending={isLoading || isFetching}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}
        {selectedTab === 'ditolak' && (
          <DitolakComponent
            key={refreshKey}
            dataDitolak={allItems}
            Pending={isLoading || isFetching}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}
