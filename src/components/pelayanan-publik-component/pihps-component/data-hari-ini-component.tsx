import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type HargaKomoditiPasarRataRata } from '@/api/disperindag';
import { EmptyListPihps } from '@/components/ui';

import CardPasar from './card-pasar-component';

interface dataHariIniProps {
  dataHariIni: HargaKomoditiPasarRataRata[] | undefined;
  Pending: boolean;
}

export default function DataHariIni({
  dataHariIni,
  Pending,
}: dataHariIniProps) {
  const renderItem = React.useCallback(
    ({ item }: { item: HargaKomoditiPasarRataRata }) => (
      <CardPasar data={item} />
    ),
    []
  );
  return (
    <FlashList
      data={dataHariIni}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyListPihps isLoading={Pending} />}
      estimatedItemSize={300}
      numColumns={2}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 20,
      }}
    />
  );
}
