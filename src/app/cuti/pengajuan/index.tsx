/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type CutiPegawaiVerif } from '@/api/cuti';
import { useInfiniteCutiPegawaiVerif } from '@/api/cuti/use-get-data-cuti-verif';
import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import CardPengajuanCuti from '@/components/cuti-component/pengajuan-component/card-pengajuan-cuti';
import FormListPengajuan from '@/components/cuti-component/pengajuan-component/form-list-pengajuan';
import { EmptyListCuti, Text } from '@/components/ui';
import { getMessage } from '@/lib';
import { useDebouncedValue } from '@/utils/debaunce';

export default function Pengajuan() {
  const storedMessage = getMessage();
  const [filters, setFilters] = useState({
    search: '',
    kode_unit_kerja: '',
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
  } = useInfiniteCutiPegawaiVerif({
    limit: 30,
    search: debouncedSearch,
    kode_unit_kerja: filters.kode_unit_kerja,
    userId: storedMessage?.nik,
  });

  const listKegiatanHarianBawahan: CutiPegawaiVerif[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = React.useCallback(
    ({ item }: { item: CutiPegawaiVerif }) => (
      <CardPengajuanCuti dataCardbawahan={item} />
    ),
    []
  );

  if (error) {
    return (
      <Text className="text-red-500">
        Terjadi kesalahan:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </Text>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Pengajuan Cuti',
          headerBackTitle: 'Pengajuan Cuti',
          headerShown: false,
        }}
      />
      <CutiNavbar title="List Pengajuan Cuti" />
      <FormListPengajuan
        defaultValues={{
          search: filters.search,
          kode_unit_kerja:
            filters.kode_unit_kerja ?? storedMessage?.kode_unit_kerja,
        }}
        onChange={(values) => {
          // hindari loop: update state hanya kalau beda
          setFilters((prev) =>
            JSON.stringify(prev) === JSON.stringify(values) ? prev : values
          );
        }}
      />
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
        ListEmptyComponent={<EmptyListCuti isLoading={isLoading} />}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text className="py-2 text-center">Memuat lebih banyak…</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
