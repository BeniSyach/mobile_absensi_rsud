/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type SptData, useInfiniteSPTByUser } from '@/api';
import { CardSPT } from '@/components/list-spt-component/card';
import { Title } from '@/components/title';
import { EmptyList, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function ListSPT() {
  const storedMessage = getMessage();
  const userId = storedMessage?.nik ?? '';
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useInfiniteSPTByUser({
    variables: { userId, limit: 10 },
    enabled: !!userId,
  });

  // gabung semua page
  const spt: SptData[] = data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = React.useCallback(
    ({ item }: { item: SptData }) => <CardSPT dataSPT={item} />,
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
          title: 'List SPT',
          headerBackTitle: 'List SPT',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <Title text="Daftar Surat Perintah Tugas" textColor="#20A0D8" />

        <FlashList
          data={spt}
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
