import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AbsenMasuk } from '@/api';
import { Card } from '@/components/list-absensi-component/card';
import { Title } from '@/components/title';
import { Text } from '@/components/ui';

import ListContent from './list-content';
import UseFetchAbsen from './use-fetch-absen';

export default function ListAbsensi() {
  const { data, isPending, error, handleLoadMore, isRefreshing, onRefresh } =
    UseFetchAbsen();

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
        <ListContent
          data={data}
          isPending={isPending}
          handleLoadMore={handleLoadMore}
          renderItem={renderItem}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
