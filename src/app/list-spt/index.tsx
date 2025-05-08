import React from 'react';

import { type SPTData } from '@/api';
import { CardSPT } from '@/components/list-spt-component/card';
import { SafeAreaView, Text, View } from '@/components/ui';

import ListContent from './list-content';
import UseFetchSPT from './use-fetch-spt';

export default function ListSPT() {
  const { data, isPending, error, handleLoadMore, isRefreshing, onRefresh } =
    UseFetchSPT();

  console.log('data list SPT', data);

  const renderItem = React.useCallback(
    ({ item }: { item: SPTData }) => <CardSPT dataSPT={item} />,
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
