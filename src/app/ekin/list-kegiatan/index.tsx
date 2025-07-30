/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { useGetKegiatanHarianByUser } from '@/api';
import FormListKegiatan from '@/components/ekin-component/list-kegiatan-component/form-list-kegiatan';
import ListKegiatanComponent from '@/components/ekin-component/list-kegiatan-component/list-kegiatan-compoent';
import LogoListKegiatan from '@/components/ekin-component/list-kegiatan-component/logo-list-kegiatan';
import NavbarListKegiatan from '@/components/ekin-component/list-kegiatan-component/navbar-list-kegiatan';
import { SafeAreaView, Text } from '@/components/ui';
import { getMessage } from '@/lib';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const now = new Date();
const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);
const akhirBulan = new Date(now.getFullYear(), now.getMonth() + 1, 0);

export default function ListKegiatan() {
  const storedMessage = getMessage();
  const [search, setSearch] = useState('');
  const [tanggalAwal, setTanggalAwal] = useState(formatDate(awalBulan));
  const [tanggalAkhir, setTanggalAkhir] = useState(formatDate(akhirBulan));
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const queryParams = {
    userId: storedMessage?.nik ?? '',
    page,
    limit: 10,
    tanggalAwal,
    tanggalAkhir,
    search,
  };

  console.log('🔍 Query Params:', queryParams);

  const {
    data: dataListHarian,
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetKegiatanHarianByUser({
    variables: queryParams,
  });

  // Log setiap perubahan data
  console.log('📊 Raw API Response:', {
    dataListHarian,
    isLoading,
    isFetching,
    isError,
    page,
    allItemsLength: allItems.length,
  });

  const handleRefresh = async () => {
    console.log('🔄 Refresh triggered');
    setRefreshing(true);

    // Reset state untuk refresh
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
    setRefreshKey((prev) => prev + 1); // Force re-render

    try {
      // Tunggu refetch selesai
      const result = await refetch();
      console.log('🔄 Refresh result:', result);
    } catch (err) {
      console.error('Refresh error:', err);
    }

    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasNextPage) {
      console.log('📄 Load more triggered, current page:', page);
      setPage((prev) => prev + 1);
    }
  };

  // Handle search/filter changes
  const handleSearchChange = (newSearch: string) => {
    console.log('🔍 Search changed:', newSearch);
    setSearch(newSearch);
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
  };

  const handleTanggalAwalChange = (newDate: string) => {
    console.log('📅 Tanggal Awal changed:', newDate);
    setTanggalAwal(newDate);
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
  };

  const handleTanggalAkhirChange = (newDate: string) => {
    console.log('📅 Tanggal Akhir changed:', newDate);
    setTanggalAkhir(newDate);
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
  };

  // Handle data updates
  useEffect(() => {
    if (dataListHarian) {
      console.log('💾 Processing API data:', dataListHarian);

      // Coba berbagai kemungkinan struktur response
      let items = [];

      // Kemungkinan 1: data.data
      if (dataListHarian.data && Array.isArray(dataListHarian.data)) {
        items = dataListHarian.data;
        console.log('✅ Found data in dataListHarian.data');
      }
      // Kemungkinan 2: data saja (langsung array)
      else if (Array.isArray(dataListHarian)) {
        items = dataListHarian;
        console.log('✅ Found data as direct array');
      }
      // Kemungkinan 3: data.items
      else if (dataListHarian.data && Array.isArray(dataListHarian.data)) {
        items = dataListHarian.data;
        console.log('✅ Found data in dataListHarian.items');
      }
      // Kemungkinan 4: data.result
      else if (dataListHarian.data && Array.isArray(dataListHarian.data)) {
        items = dataListHarian.data;
        console.log('✅ Found data in dataListHarian.result');
      } else {
        console.log(
          '❌ No array data found. Structure:',
          Object.keys(dataListHarian)
        );
        items = [];
      }

      console.log('📦 Extracted items:', items);
      console.log('📊 Items count:', items.length);

      if (items.length >= 0) {
        // Ubah dari > 0 ke >= 0 untuk handle empty array
        setAllItems((prevItems) => {
          // Jika sedang refresh (refreshing true), langsung replace
          if (refreshing && page === 1) {
            console.log('🔄 Refreshing: replacing all items');
            return items;
          }

          const newItems = page === 1 ? items : [...prevItems, ...items];
          console.log('🔄 Updated allItems:', {
            prevLength: prevItems.length,
            newItemsLength: items.length,
            finalLength: newItems.length,
            page,
            refreshing,
          });
          return newItems;
        });

        // Update hasNextPage
        setHasNextPage(items.length >= 10);
        console.log('🔄 HasNextPage:', items.length >= 10);
      }
    }
  }, [dataListHarian, page, refreshing]); // Tambahkan refreshing ke dependency

  if (isError) {
    console.error('❌ API Error:', error);
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#287BDC]">
        <Text className="px-4 text-center text-white">
          Terjadi kesalahan:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </SafeAreaView>
    );
  }

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
          <NavbarListKegiatan />
          <LogoListKegiatan />
        </ImageBackground>

        <FormListKegiatan
          search={search}
          tanggalAwal={tanggalAwal}
          tanggalAkhir={tanggalAkhir}
          onSearchChange={handleSearchChange}
          onTanggalAwalChange={handleTanggalAwalChange}
          onTanggalAkhirChange={handleTanggalAkhirChange}
        />

        <ListKegiatanComponent
          key={refreshKey}
          dataHarian={{ items: allItems }}
          Pending={isLoading || isFetching}
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
