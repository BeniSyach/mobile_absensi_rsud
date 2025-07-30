import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type RhkStaffChildItem } from '@/api';
import { EmptyListEkin } from '@/components/ui';

import CardHasilKerja from './card-list-hasil-kerja';

interface dataListKegiatan {
  dataRHK: RhkStaffChildItem[];
  Pending: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  atasan: string | undefined;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function ListHasilKerjaComponent({
  dataRHK,
  Pending,
  onLoadMore,
  hasNextPage,
  atasan,
  onRefresh,
  refreshing,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: RhkStaffChildItem }) => (
      <CardHasilKerja dataRHKItems={item} atasanNik={atasan} />
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
