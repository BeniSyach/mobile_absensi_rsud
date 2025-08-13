import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type KegiatanHarianPejabat } from '@/api';
import { EmptyListEkin } from '@/components/ui';

import CardListPejabatKomponent from './card-list-pejabat-komponent';

interface dataListKegiatan {
  dataHarian?: { items: KegiatanHarianPejabat[] }; // Bisa diganti sesuai tipe
  Pending: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function ListKegiatanPejabatComponent({
  dataHarian,
  Pending,
  onLoadMore,
  hasNextPage,
  onRefresh,
  refreshing,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: KegiatanHarianPejabat }) => (
      <CardListPejabatKomponent dataHarian={item} />
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
