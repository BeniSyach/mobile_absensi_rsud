import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type Tagihan } from '@/api/bapenda';
import { EmptyListEkin } from '@/components/ui';

import CardNilaiBawahan from './card-list-nilai-bawahan';

interface dataListKegiatan {
  dataTagihan: Tagihan[];
  Pending: boolean;
}

export default function ListNilaiBawahanComponent({
  dataTagihan,
  Pending,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: Tagihan }) => <CardNilaiBawahan dataTagihan={item} />,
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
