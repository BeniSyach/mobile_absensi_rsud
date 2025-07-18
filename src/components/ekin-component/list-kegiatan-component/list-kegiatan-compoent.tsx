import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type Tagihan } from '@/api/bapenda';
import { EmptyListEkin } from '@/components/ui';

import CardListKomponent from './card-list-komponent';

interface dataListKegiatan {
  dataTagihan: Tagihan[];
  Pending: boolean;
}

export default function ListKegiatanComponent({
  dataTagihan,
  Pending,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: Tagihan }) => <CardListKomponent dataTagihan={item} />,
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
