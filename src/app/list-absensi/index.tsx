/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AbsenMasuk, useInfiniteAbsenMasukByUser } from '@/api';
import { Card } from '@/components/list-absensi-component/card';
import { Title } from '@/components/title';
import { EmptyList, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function ListAbsensi() {
  const storedMessage = getMessage();
  const userId = storedMessage?.nik ?? '';
  // ganti UseFetchAbsen -> langsung pakai infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useInfiniteAbsenMasukByUser({
    variables: { userId, limit: 10 },
    enabled: true,
  });

  // gabung semua page
  const absensi: AbsenMasuk[] = data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = React.useCallback(
    ({ item }: { item: AbsenMasuk }) => <Card data={item} />,
    []
  );

  if (error) {
    return (
      <View>
        <Text>Error Loading Data</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'List Absensi',
          headerBackTitle: 'List Absensi',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <Title text="Daftar Absensi" textColor="#20A0D8" />

        <FlashList
          data={absensi}
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
