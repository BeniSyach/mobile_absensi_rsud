import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type Tagihan } from '@/api/bapenda';
import { EmptyListEkin } from '@/components/ui';

import CardHasilKerja from './card-list-hasil-kerja';

interface dataListKegiatan {
  dataTagihan: Tagihan[];
  Pending: boolean;
}

export default function ListHasilKerjaComponent({
  dataTagihan,
  Pending,
}: dataListKegiatan) {
  const renderItem = React.useCallback(
    ({ item }: { item: Tagihan }) => <CardHasilKerja dataTagihan={item} />,
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
