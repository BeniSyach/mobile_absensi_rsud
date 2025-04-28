import React from 'react';

import { type SPTData } from '@/api';
import { CardSPT } from '@/components/list-spt-component/card';
import { SafeAreaView, Text, View } from '@/components/ui';

import UseFetchAbsen from '../list-absensi/use-fetch-absen';
import ListContent from './list-content';

export default function ListSPT() {
  const { data, isPending, error, handleLoadMore, isRefreshing, onRefresh } =
    UseFetchAbsen();

  console.log('data list absensi', data);

  const renderItem = React.useCallback(
    ({ item }: { item: SPTData }) => <CardSPT data={item} />,
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
