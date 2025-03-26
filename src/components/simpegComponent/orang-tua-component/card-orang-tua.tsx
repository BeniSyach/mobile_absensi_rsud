import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type OrangTuaResponse } from '@/api/simpeg/orang-tua';
import { EmptyList, View } from '@/components/ui';

import CardOrangTuaComp from './card-orang-tua-comp';

export default function CardOrangTua({
  data,
  isLoading,
}: {
  data: OrangTuaResponse['data']['data'];
  isLoading: boolean;
}) {
  const renderItem = React.useCallback(
    ({ item }: { item: OrangTuaResponse['data']['data'][number] }) => (
      <CardOrangTuaComp data={item} />
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
