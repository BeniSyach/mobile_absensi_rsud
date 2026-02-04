import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';

import { type AciSkpd } from '../../aci-service';
import { useSkpdLogic } from './use-skpd-logic';

const SkpdItem = ({
  skpd,
  onPress,
}: {
  skpd: AciSkpd;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-3 flex-row items-center rounded-2xl bg-white p-4 shadow-sm shadow-gray-200 active:bg-gray-50"
  >
    <View className="mr-4 size-12 items-center justify-center rounded-full bg-orange-50">
      <Ionicons name="business" size={20} color="#F97316" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-bold text-[#0B2347]">
        {skpd.nama_skpd}
      </Text>
      <Text className="text-xs text-gray-400">
        Dibuat:{' '}
        {new Date(skpd.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const SkpdListHeader = ({
  search,
  handleSearch,
  router,
}: {
  search: string;
  handleSearch: (text: string) => void;
  router: any;
}) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Manajemen SKPD</Text>
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full bg-[#0066FF] shadow-sm shadow-blue-200"
        onPress={() => router.push('/pelayanan-publik/aci/admin/skpd/create')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>

    {/* Search Bar */}
    <View className="mt-4 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <Ionicons name="search" size={20} color="#9CA3AF" />
      <TextInput
        placeholder="Cari SKPD..."
        className="ml-2 flex-1 text-base text-[#0B2347]"
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={handleSearch}
      />
    </View>
  </View>
);

export default function SkpdList() {
  const router = useRouter();
  const {
    skpds,
    loading,
    search,
    refreshing,
    page,
    handleSearch,
    handleLoadMore,
    onRefresh,
  } = useSkpdLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <SkpdListHeader
        search={search}
        handleSearch={handleSearch}
        router={router}
      />

      <FlatList
        data={skpds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SkpdItem
            skpd={item}
            onPress={() =>
              router.push(`/pelayanan-publik/aci/admin/skpd/${item.id}`)
            }
          />
        )}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="mt-20 items-center">
              <Text className="text-gray-400">Tidak ada SKPD ditemukan</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <View className="py-4">
              <ActivityIndicator color="#6366F1" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
