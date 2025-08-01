import React from 'react';
import { StatusBar } from 'react-native';

import { type SptData } from '@/api';
import { CardSPT } from '@/components/list-spt-component/card';
import { SafeAreaView, Text, View } from '@/components/ui';

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
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="dark-content" />
      <ListContent
        data={data}
        isPending={isPending}
        handleLoadMore={handleLoadMore}
        renderItem={renderItem}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}
