/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import { useListBawahan } from '@/api';
import FormNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/form-nilai-bawahan';
import ListNilaiBawahanComponent from '@/components/ekin-component/beri-nilai-bawahan/list-nilai-bawahan';
import LogoNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/logo-nilai-bawahan';
import NavbarNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/navbar-nilai-bawahan';
import { SafeAreaView, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function BeriNilaiBawahan() {
  const storedMessage = getMessage();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [allItems, setAllItems] = useState<any[]>([]); // Optional: use KegiatanHarianItem[]
  const [hasNextPage, setHasNextPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const queryParams = {
    nik_atasan: storedMessage?.nik ?? '',
    page,
    limit: 10,
    search,
  };

  const {
    data: dataListBawahan,
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
  } = useListBawahan({
    variables: queryParams,
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
      setPage((prev) => prev + 1);
    }
  };

  const handleSearchChange = (newSearch: string) => {
    console.log('🔍 Search changed:', newSearch);
    setSearch(newSearch);
    setPage(1);
    setAllItems([]);
    setHasNextPage(true);
  };

  useEffect(() => {
    if (dataListBawahan) {
      console.log('💾 Processing API data:', dataListBawahan);

      // Coba berbagai kemungkinan struktur response
      let items = [];

      // Kemungkinan 1: data.data
      if (dataListBawahan.data && Array.isArray(dataListBawahan.data)) {
        items = dataListBawahan.data;
        console.log('✅ Found data in dataListBawahan.data');
      }
      // Kemungkinan 2: data saja (langsung array)
      else if (Array.isArray(dataListBawahan)) {
        items = dataListBawahan;
        console.log('✅ Found data as direct array');
      }
      // Kemungkinan 3: data.items
      else if (dataListBawahan.data && Array.isArray(dataListBawahan.data)) {
        items = dataListBawahan.data;
        console.log('✅ Found data in dataListBawahan.items');
      }
      // Kemungkinan 4: data.result
      else if (dataListBawahan.data && Array.isArray(dataListBawahan.data)) {
        items = dataListBawahan.data;
        console.log('✅ Found data in dataListBawahan.result');
      } else {
        console.log(
          '❌ No array data found. Structure:',
          Object.keys(dataListBawahan)
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
  }, [dataListBawahan, page, refreshing]); // Tambahkan refreshing ke dependency

  if (isError) {
    return (
      <Text className="text-red-500">
        Terjadi kesalahan:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </Text>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
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
          <NavbarNilaiBawahan />
          <LogoNilaiBawahan />
        </ImageBackground>
        <FormNilaiBawahan search={search} onSearchChange={handleSearchChange} />
        <ListNilaiBawahanComponent
          key={refreshKey}
          dataBawahan={allItems}
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
