import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type TagihanPad } from '@/api/bapenda';
import { EmptyListPad } from '@/components/ui';

import CardDetailPad from './card-detail-pad';

interface dataPad {
  data: TagihanPad[];
  Pending: boolean;
}

export default function DataDetailPad({ data, Pending }: dataPad) {
  const renderItem = React.useCallback(
    ({ item }: { item: TagihanPad }) => <CardDetailPad data={item} />,
    []
  );
  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyListPad isLoading={Pending} />}
      estimatedItemSize={300}
      onEndReached={() => {}}
      onEndReachedThreshold={0.5}
    />
  );
}
