import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar, View } from 'react-native';

import { type SptData } from '@/api';
import { CardSPT } from '@/components/list-spt-component/card';
import { Title } from '@/components/title';
import { Text } from '@/components/ui';

import ListContent from './list-content';
import UseFetchSPT from './use-fetch-spt';

export default function ListSPT() {
  const { data, isPending, error, handleLoadMore, isRefreshing, onRefresh } =
    UseFetchSPT();

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
    <SafeAreaView className="flex-1">
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
