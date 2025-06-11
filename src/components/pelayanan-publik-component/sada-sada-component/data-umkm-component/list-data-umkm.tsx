import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { type UMKMResponse, type Usaha } from '@/api/sada-sada';
import { EmptyListUmkm, Text, View } from '@/components/ui';

import CardDataUmkm from './card-data-umkm';

interface dataUmkm {
  dataUmkm: UMKMResponse;
  Pending: boolean;
  dataUsaha: Usaha[];
}

export default function ListDataUmkm({
  dataUmkm,
  Pending,
  dataUsaha,
}: dataUmkm) {
  const renderItem = React.useCallback(
    ({ item }: { item: Usaha }) => <CardDataUmkm data={item} />,
    []
  );

  const dataFields = [
    ['Nomor NIK', dataUmkm.data.nomorIndukKependudukan],
    ['Nama', dataUmkm.data.namaLengkap],
    ['Alamat', dataUmkm.data.alamatPribadi],
    ['Telepon', dataUmkm.data.nomorTelepon],
    ['Email', dataUmkm.data.email],
  ];

  const filledFields = dataFields.filter(
    ([, value]) => value && value.trim() !== ''
  );

  return (
    <View className="flex-1">
      {filledFields.length > 0 && (
        <View className="m-3 rounded-lg bg-white p-4 shadow-md">
          <View className="space-y-3">
            {filledFields.map(([label, value], index) => (
              <View key={index} className="flex-row items-start">
                <Text className="w-40 text-sm font-medium text-gray-700">
                  {label}
                </Text>
                <Text className="mr-1 text-sm text-gray-600">:</Text>
                <Text className="flex-1 text-sm font-semibold text-gray-900">
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <FlashList
        data={dataUsaha}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyListUmkm isLoading={Pending} />}
        estimatedItemSize={300}
        onEndReached={() => {}}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
