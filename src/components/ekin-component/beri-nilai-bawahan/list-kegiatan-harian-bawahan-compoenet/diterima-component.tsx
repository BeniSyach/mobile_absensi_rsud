import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type DetailKegiatan } from '@/api';
import { Text } from '@/components/ui';
import { EmptyListEkin } from '@/components/ui';

import CardListKegiatanHarianBawahan from './card-list-kegiatan-harian-bawahan';

interface dataListKegiatan {
  dataDisetujui: DetailKegiatan[];
  Pending: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function DiterimaComponent({
  dataDisetujui,
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
  return (
    <FlashList
      data={dataDisetujui}
      estimatedItemSize={60}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={() => {
        if (hasNextPage && !Pending) {
          onLoadMore();
        }
      }}
      ListEmptyComponent={<EmptyListEkin isLoading={Pending} />}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        Pending ? (
          <Text className="py-2 text-center">Memuat lebih banyak…</Text>
        ) : null
      }
    />
  );
}
