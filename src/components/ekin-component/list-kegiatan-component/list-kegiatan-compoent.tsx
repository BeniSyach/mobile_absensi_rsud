import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type KegiatanHarianbynik } from '@/api';
import { EmptyListEkin } from '@/components/ui';

import CardListKomponent from './card-list-komponent';

interface dataListKegiatan {
  dataHarian?: { items: KegiatanHarianbynik[] }; // Bisa diganti sesuai tipe
  Pending: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function ListKegiatanComponent({
  dataHarian,
  Pending,
  onLoadMore,
  hasNextPage,
  onRefresh,
  refreshing,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: KegiatanHarianbynik }) => (
      <CardListKomponent dataHarian={item} />
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
      data={dataHarian?.items ?? []}
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
