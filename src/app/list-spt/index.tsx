import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { GetAllSPTbyUser, type GetAllSPTResponse } from '@/api';
import { CardSPT } from '@/components/list-spt-component/card';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { getMessage, type UserData } from '@/lib/message-storage';

export default function ListSpt() {
  const [message, setMessage] = useState<UserData | null>(null);
  useEffect(() => {
    const storedMessage = getMessage();
    if (storedMessage) {
      setMessage(storedMessage);
    }
  }, []);

  const { data, isLoading, error } = GetAllSPTbyUser({
    variables: { userId: message?.id },
    enabled: !!message?.id,
  });

  const renderItem = React.useCallback(
    ({ item }: { item: GetAllSPTResponse }) => <CardSPT data={item} />,
    []
  );

  if (error) {
    return (
      <View>
        <Stack.Screen
          options={{
            title: 'List Surat Perintah Tugas',
            headerBackTitle: 'list-spt',
          }}
        />
        <Text>Error Loading data</Text>
      </View>
    );
  }
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: 'List Surat Perintah Tugas',
          headerBackTitle: 'list-spt',
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
