import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
  type ApiResponse,
  GetAllSPTbyUser,
  type GetAllSPTResponse,
} from '@/api';
import { CardSPT } from '@/components/list-spt-component/card';
import {
  EmptyList,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function ListSpt() {
  const [message, setMessage] = useState<ApiResponse | null>(null);
  useEffect(() => {
    const storedMessage = getMessage();
    if (storedMessage) {
      setMessage(storedMessage);
    }
  }, []);

  const { data, isLoading, error } = GetAllSPTbyUser();

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
    <SafeAreaView className="flex-1 bg-[#0B3880]">
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
    </SafeAreaView>
  );
}
