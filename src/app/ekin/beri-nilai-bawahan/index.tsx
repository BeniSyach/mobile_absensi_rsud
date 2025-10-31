/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type BawahanRekapNilaiBawahan, useListBawahanInfinite } from '@/api';
import CardNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/card-list-nilai-bawahan';
import FormNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/form-nilai-bawahan';
import LogoNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/logo-nilai-bawahan';
import NavbarNilaiBawahan from '@/components/ekin-component/beri-nilai-bawahan/navbar-nilai-bawahan';
import { EmptyList, Text } from '@/components/ui';
import { getMessage } from '@/lib';
import { useDebouncedValue } from '@/utils/debaunce';

export default function BeriNilaiBawahan() {
  const storedMessage = getMessage();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useListBawahanInfinite({
    nik_atasan: storedMessage?.nik ?? '',
    limit: 30,
    search: debouncedSearch,
  });

  const listKegiatanHarianBawahan: BawahanRekapNilaiBawahan[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = React.useCallback(
    ({ item }: { item: BawahanRekapNilaiBawahan }) => (
      <CardNilaiBawahan dataCardbawahan={item} />
    ),
    []
  );

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
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

        <FlashList
          data={listKegiatanHarianBawahan}
          estimatedItemSize={60}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          ListEmptyComponent={<EmptyList isLoading={isLoading} />}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Text className="py-2 text-center">Memuat lebih banyak…</Text>
            ) : null
          }
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
