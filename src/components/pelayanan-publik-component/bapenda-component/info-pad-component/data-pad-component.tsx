import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type WajibPajak } from '@/api/bapenda';
import { EmptyListPad } from '@/components/ui';

import CardPad from './card-pad';

interface dataPad {
  data: WajibPajak[];
  Pending: boolean;
}

export default function DataPadComponent({ data, Pending }: dataPad) {
  const renderItem = React.useCallback(
    ({ item }: { item: WajibPajak }) => <CardPad data={item} />,
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
