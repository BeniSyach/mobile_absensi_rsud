import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type KeluargaResponse } from '@/api/simpeg/keluarga';
import { EmptyList, View } from '@/components/ui';

import CardKeluargaComp from './card-keluarga-comp';

export default function CardKeluarga({
  data,
  isLoading,
}: {
  data: KeluargaResponse['data']['data'];
  isLoading: boolean;
}) {
  const renderItem = React.useCallback(
    ({ item }: { item: KeluargaResponse['data']['data'][number] }) => (
      <CardKeluargaComp data={item} />
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
