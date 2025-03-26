import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type PendidikanResponse } from '@/api/simpeg/pendidikan';
import { EmptyList, View } from '@/components/ui';

import CardPendidikanComp from './card-pendidikan-comp';

export default function CardPendidikan({
  data,
  isLoading,
}: {
  data: PendidikanResponse['data']['data'];
  isLoading: boolean;
}) {
  const renderItem = React.useCallback(
    ({ item }: { item: PendidikanResponse['data']['data'][number] }) => (
      <CardPendidikanComp data={item} />
    ),
    []
  );
  return (
    <View className="mx-5 my-2 mt-1 flex flex-1 flex-col space-y-2 rounded-xl bg-white p-4 shadow">
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isLoading} />}
        estimatedItemSize={300}
      />
    </View>
  );
}
