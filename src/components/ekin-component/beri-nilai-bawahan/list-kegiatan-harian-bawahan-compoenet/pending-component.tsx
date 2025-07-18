import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type Tagihan } from '@/api/bapenda';
import { EmptyListEkin } from '@/components/ui';

import CardListKegiatanHarianBawahan from './card-list-kegiatan-harian-bawahan';

interface dataListKegiatan {
  dataTagihan: Tagihan[];
  Pending: boolean;
}

export default function PendingComponent({
  dataTagihan,
  Pending,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: Tagihan }) => (
      <CardListKegiatanHarianBawahan dataTagihan={item} />
    ),
    []
  );

  return (
    <FlashList
      data={dataTagihan}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyListEkin isLoading={Pending} />}
      estimatedItemSize={300}
      onEndReached={() => {}}
      onEndReachedThreshold={0.5}
    />
  );
}
