import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type DataItemRHKPejabat } from '@/api';
import { EmptyListEkin } from '@/components/ui';

import CardHasilKerjaAtasan from './card-list-hasil-kerja';

interface dataListKegiatan {
  dataRHK: DataItemRHKPejabat[];
  Pending: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function ListHasilKerjaAtasanComponent({
  dataRHK,
  Pending,
  onLoadMore,
  hasNextPage,
  onRefresh,
  refreshing,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: DataItemRHKPejabat }) => (
      <CardHasilKerjaAtasan dataRHKItems={item} />
    ),
    []
  );
  const handleLoadMore = React.useCallback(() => {
    if (!Pending && hasNextPage) {
      onLoadMore();
    }
  }, [Pending, hasNextPage, onLoadMore]);
  return (
    <FlashList
      data={dataRHK}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyListEkin isLoading={Pending} />}
      estimatedItemSize={300}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
