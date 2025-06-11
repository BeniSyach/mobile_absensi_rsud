import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type Tagihan } from '@/api/bapenda';
import { EmptyListPbb } from '@/components/ui';

import CardPbb from './card-pbb';

interface dataPBB {
  dataTagihan: Tagihan[];
  Pending: boolean;
}

export default function ListNopComponent({ dataTagihan, Pending }: dataPBB) {
  const renderItem = React.useCallback(
    ({ item }: { item: Tagihan }) => <CardPbb dataTagihan={item} />,
    []
  );

  return (
    <FlashList
      data={dataTagihan}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyListPbb isLoading={Pending} />}
      estimatedItemSize={300}
      onEndReached={() => {}}
      onEndReachedThreshold={0.5}
    />
  );
}
