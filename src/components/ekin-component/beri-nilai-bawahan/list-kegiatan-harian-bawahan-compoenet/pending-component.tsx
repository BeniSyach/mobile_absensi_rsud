import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type DetailKegiatan } from '@/api';
import { EmptyListEkin } from '@/components/ui';

import CardListKegiatanHarianBawahan from './card-list-kegiatan-harian-bawahan';

interface dataListKegiatan {
  dataPending: DetailKegiatan[];
  Pending: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function PendingComponent({
  dataPending,
  Pending,
  onLoadMore,
  hasNextPage,
  onRefresh,
  refreshing,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: DetailKegiatan }) => (
      <CardListKegiatanHarianBawahan dataCard={item} />
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
      data={dataPending}
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
