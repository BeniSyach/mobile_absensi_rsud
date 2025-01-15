import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React from 'react';
import { RefreshControl } from 'react-native';

import { EmptyList, FocusAwareStatusBar, View } from '@/components/ui';

const ListContent = ({
  data,
  isPending,
  handleLoadMore,
  renderItem,
  isRefreshing,
  onRefresh,
}: {
  data: any;
  isPending: boolean;
  isRefreshing: boolean;
  handleLoadMore: () => void;
  renderItem: (item: any) => JSX.Element;
  onRefresh: () => void;
}) => (
  <View className="flex-1">
    <FocusAwareStatusBar />
    <Stack.Screen
      options={{
        title: 'List Absensi',
        headerBackTitle: 'list-absensi',
      }}
    />
    <FlashList
      data={data || []}
      renderItem={renderItem}
      keyExtractor={(_, index) => `item-${index}`}
      ListEmptyComponent={<EmptyList isLoading={isPending} />}
      estimatedItemSize={300}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  </View>
);

export default ListContent;
