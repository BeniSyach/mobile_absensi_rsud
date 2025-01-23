import React from 'react';
import { View } from 'react-native';

import { type AbsenMasukDanPulangByUserResponse } from '@/api';
import { Card } from '@/components/list-absensi-component/card';
import { Text } from '@/components/ui';

import ListContent from './list-content';
import UseFetchAbsen from './use-fetch-absen';

export default function ListAbsensi() {
  const { data, isPending, error, handleLoadMore, isRefreshing, onRefresh } =
    UseFetchAbsen();

  const renderItem = React.useCallback(
    ({ item }: { item: AbsenMasukDanPulangByUserResponse }) => (
      <Card data={item} />
    ),
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
    <ListContent
      data={data}
      isPending={isPending}
      handleLoadMore={handleLoadMore}
      renderItem={renderItem}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
}
