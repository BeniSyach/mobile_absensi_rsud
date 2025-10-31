/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type DataItemRHKPejabat, useRhkPejabatChildInfinite } from '@/api';
import CardHasilKerjaAtasan from '@/components/ekin-component/rencana-hasil-kerja-atasan-compoenet/card-list-hasil-kerja';
import FormHasilKerja from '@/components/ekin-component/rencana-hasil-kerja-component/form-hasil-kerja';
import LogoHasilKerja from '@/components/ekin-component/rencana-hasil-kerja-component/logo-hasil-kerja';
import NavbarHasilKerjaComponent from '@/components/ekin-component/rencana-hasil-kerja-component/navbar-hasil-kerja-component';
import { Button, EmptyList, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function RencanaHasilKinerja() {
  const router = useRouter();
  const storedMessage = getMessage();
  const [search, setSearch] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useRhkPejabatChildInfinite({
    nik: storedMessage?.nik ?? '',
    limit: 30,
    search,
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const ListRHKPejabatChild: DataItemRHKPejabat[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = React.useCallback(
    ({ item }: { item: DataItemRHKPejabat }) => (
      <CardHasilKerjaAtasan dataRHKItems={item} />
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

        <FlashList
          data={ListRHKPejabatChild}
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
        <View className="flex-row justify-center px-5 py-2">
          <Button
            label="Tambah Rencana hasil Kerja"
            onPress={() =>
              router.push({
                pathname: '/ekin/rencana-hasil-kerja-atasan/post-rhk',
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
