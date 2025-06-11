import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type HargaKomoditiPasarRataRata } from '@/api/disperindag';
import { EmptyListPihps } from '@/components/ui';

import CardPasar from './card-pasar-component';

interface dataresPasar {
  dataPasar: HargaKomoditiPasarRataRata[];
  Pending: boolean;
}

export default function DataHasilPasar({ dataPasar, Pending }: dataresPasar) {
  const renderItem = React.useCallback(
    ({ item }: { item: HargaKomoditiPasarRataRata }) => (
      <CardPasar data={item} />
    ),
    []
  );
  return (
    <FlashList
      data={dataPasar}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyListPihps isLoading={Pending} />}
      estimatedItemSize={300}
      numColumns={2}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    />
  );
}
