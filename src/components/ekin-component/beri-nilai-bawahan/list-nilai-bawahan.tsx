import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type BawahanRekapNilaiBawahan } from '@/api';
import { EmptyListEkin } from '@/components/ui';

import CardNilaiBawahan from './card-list-nilai-bawahan';

interface dataListKegiatan {
  dataBawahan: BawahanRekapNilaiBawahan[];
  Pending: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function ListNilaiBawahanComponent({
  dataBawahan,
  Pending,
  onLoadMore,
  hasNextPage,
  onRefresh,
  refreshing,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: BawahanRekapNilaiBawahan }) => (
      <CardNilaiBawahan dataCardbawahan={item} />
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
      data={dataBawahan}
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
