import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';

import { KategoriHeader } from './kategori/components/kategori-header';
import { KategoriItem } from './kategori/components/kategori-item';
import { useKategoriLogic } from './kategori/use-kategori-logic';

export default function KategoriList() {
  const {
    kategoris,
    loading,
    search,
    refreshing,
    handleSearch,
    handleLoadMore,
    onRefresh,
  } = useKategoriLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />

      <KategoriHeader search={search} onSearchChange={handleSearch} />

      <FlatList
        data={kategoris}
        renderItem={({ item }) => <KategoriItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator className="py-4" color="#0066FF" />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-500">Tidak ada data kategori</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
