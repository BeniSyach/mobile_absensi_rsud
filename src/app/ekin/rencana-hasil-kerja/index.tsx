/* eslint-disable max-lines-per-function */
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GetRhkStaffChild, UseProfileEkin } from '@/api';
import FormHasilKerja from '@/components/ekin-component/rencana-hasil-kerja-component/form-hasil-kerja';
import ListHasilKerjaComponent from '@/components/ekin-component/rencana-hasil-kerja-component/list-hasil-kerja';
import LogoHasilKerja from '@/components/ekin-component/rencana-hasil-kerja-component/logo-hasil-kerja';
import NavbarHasilKerjaComponent from '@/components/ekin-component/rencana-hasil-kerja-component/navbar-hasil-kerja-component';
import { Button, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function RencanaHasilKinerja() {
  const router = useRouter();
  const storedMessage = getMessage();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]); // Optional: use KegiatanHarianItem[]
  const [hasNextPage, setHasNextPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: dataProfile, error: errorProfileEkin } = UseProfileEkin();

  const queryParams = {
    nik: storedMessage?.nik ?? '',
    page,
    limit: 30,
    search,
  };

  const {
    data: dataRHK,
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
  } = GetRhkStaffChild({
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

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
  };

  useEffect(() => {
    if (dataRHK) {
      // Coba berbagai kemungkinan struktur response
      let items = [];

      // Kemungkinan 1: data.data
      if (dataRHK.data && Array.isArray(dataRHK.data)) {
        items = dataRHK.data;
      }
      // Kemungkinan 2: data saja (langsung array)
      else if (Array.isArray(dataRHK)) {
        items = dataRHK;
      }
      // Kemungkinan 3: data.items
      else if (dataRHK.data && Array.isArray(dataRHK.data)) {
        items = dataRHK.data;
      }
      // Kemungkinan 4: data.result
      else if (dataRHK.data && Array.isArray(dataRHK.data)) {
        items = dataRHK.data;
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
  }, [dataRHK, page, refreshing]); // Tambahkan refreshing ke dependency

  if (isError || errorProfileEkin) {
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
        <FormHasilKerja search={search} onSearchChange={handleSearchChange} />
        <ListHasilKerjaComponent
          key={refreshKey}
          dataRHK={allItems}
          Pending={isLoading || isFetching}
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          atasan={dataProfile?.atasan.nik as string | undefined}
        />
        <View className="flex-row justify-center px-5 py-2">
          <Button
            label="Tambah Rencana hasil Kerja"
            onPress={() =>
              router.push({
                pathname: '/ekin/rencana-hasil-kerja/post-rhk',
                params: {
                  atasan: dataProfile?.atasan.nik,
                },
              })
            }
            variant="outline"
            className="m-5 rounded-xl bg-[#287BDC] font-bold text-white"
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
