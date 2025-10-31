/* eslint-disable max-lines-per-function */
import 'dayjs/locale/id';

import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type KegiatanItem, useInfiniteKegiatanHarianByUser } from '@/api';
import CardListKomponent from '@/components/ekin-component/list-kegiatan-component/card-list-komponent';
import FormListKegiatan from '@/components/ekin-component/list-kegiatan-component/form-list-kegiatan';
import LogoListKegiatan from '@/components/ekin-component/list-kegiatan-component/logo-list-kegiatan';
import NavbarListKegiatan from '@/components/ekin-component/list-kegiatan-component/navbar-list-kegiatan';
import { EmptyList, Text } from '@/components/ui';
import { getMessage } from '@/lib';
import { useDebouncedValue } from '@/utils/debaunce';

dayjs.locale('id');

const now = new Date();
const awalBulan = dayjs(new Date(now.getFullYear(), now.getMonth(), 1)).format(
  'YYYY-MM-DD'
);
const akhirBulan = dayjs(
  new Date(now.getFullYear(), now.getMonth() + 1, 0)
).format('YYYY-MM-DD');

export default function ListKegiatan() {
  const storedMessage = getMessage();

  // simpan filter global di parent
  const [filters, setFilters] = useState({
    search: '',
    tanggalAwal: awalBulan,
    tanggalAkhir: akhirBulan,
  });

  const debouncedSearch = useDebouncedValue(filters.search, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useInfiniteKegiatanHarianByUser({
    userId: storedMessage?.nik ?? '',
    limit: 30,
    tanggalAwal: filters.tanggalAwal,
    tanggalAkhir: filters.tanggalAkhir,
    search: debouncedSearch,
  });

  // gabung semua page
  const listKegiatan: KegiatanItem[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = React.useCallback(
    ({ item }: { item: KegiatanItem }) => (
      <CardListKomponent dataHarian={item} />
    ),
    []
  );

  if (error) {
    console.error('❌ API Error:', error);
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-[#287BDC]"
        edges={['top', 'left', 'right']}
      >
        <Text className="px-4 text-center text-white">
          Terjadi kesalahan:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </SafeAreaView>
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
          <NavbarListKegiatan />
          <LogoListKegiatan />
        </ImageBackground>

        <FormListKegiatan
          key="form-kegiatan" // biar stabil
          defaultValues={{
            search: filters.search,
            tanggalAwal: filters.tanggalAwal,
            tanggalAkhir: filters.tanggalAkhir,
          }}
          onChange={(values) => {
            // hindari loop: update state hanya kalau beda
            setFilters((prev) =>
              JSON.stringify(prev) === JSON.stringify(values) ? prev : values
            );
          }}
        />

        <FlashList
          data={listKegiatan}
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
