import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { type AbsenMasukDanPulangByUserResponse } from '@/api';
import { useGetAllAbsenMasukByUser } from '@/api/absensi/masuk/get-absen-masuk-by-user';
import { Card } from '@/components/list-absensi-component/card';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { getMessage, type UserData } from '@/lib/message-storage';

export default function ListAbsensi() {
  const [message, setMessage] = useState<UserData | null>(null);

  useEffect(() => {
    const storedMessage = getMessage();
    if (storedMessage) {
      setMessage(storedMessage);
    }
  }, []);

  const { data, isLoading, error } = useGetAllAbsenMasukByUser({
    variables: { userId: message?.id },
    enabled: !!message?.id,
  });

  const renderItem = React.useCallback(
    ({ item }: { item: AbsenMasukDanPulangByUserResponse }) => (
      <Card data={item} />
    ),
    []
  );

  if (error) {
    return (
      <View>
        <Stack.Screen
          options={{
            title: 'List Absensi',
            headerBackTitle: 'list-absensi',
          }}
        />
        <Text>Error Loading data</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <Stack.Screen
        options={{
          title: 'List Absensi',
          headerBackTitle: 'list-absensi',
        }}
      />
      <FocusAwareStatusBar />
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
