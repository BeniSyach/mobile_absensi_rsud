import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type HargaKomoditiPasarRataRata } from '@/api/disperindag';
import { EmptyListPihps } from '@/components/ui';

import CardHargaRata from './card-hasil-harga-component';

interface dataresHargaRataRata {
  dataHarga: HargaKomoditiPasarRataRata[];
  Pending: boolean;
}

export default function DataHasilHargaRata({
  dataHarga,
  Pending,
}: dataresHargaRataRata) {
  const renderItem = React.useCallback(
    ({ item }: { item: HargaKomoditiPasarRataRata }) => (
      <CardHargaRata data={item} />
    ),
    []
  );
  return (
    <FlashList
      data={dataHarga}
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
