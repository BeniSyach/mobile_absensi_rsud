/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type PengajuanCutiItem } from '@/api/cuti';
import { useInfiniteCutiPegawai } from '@/api/cuti/use-get-data-cuti';
import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import { ListRiwayatCuti } from '@/components/cuti-component/list-riwayat-cuti';
import { EmptyList, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function RiwayatCuti() {
  const storedMessage = getMessage();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useInfiniteCutiPegawai({
    userId: storedMessage?.nik ?? '',
    limit: 30,
    status: 1,
  });

  // gabung semua page
  const ListCuti: PengajuanCutiItem[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = React.useCallback(
    ({ item }: { item: PengajuanCutiItem }) => <ListRiwayatCuti data={item} />,
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
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Riwayat Cuti',
          headerBackTitle: 'Riwayat Cuti',
          headerShown: false,
        }}
      />
      <CutiNavbar title="Riwayat Cuti" />
      <Text className="p-2 text-start text-xl font-bold">
        Catatan Riwayat Cuti
      </Text>

      <FlashList
        data={ListCuti}
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
    </SafeAreaView>
  );
}
