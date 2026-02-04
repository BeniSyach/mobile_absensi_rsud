import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';

interface KategoriHeaderProps {
  search: string;
  onSearchChange: (text: string) => void;
}

export function KategoriHeader({
  search,
  onSearchChange,
}: KategoriHeaderProps) {
  const router = useRouter();

  return (
    <View className="bg-white px-6 pb-4 pt-12 shadow-sm shadow-gray-100">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0B2347]">
          Manajemen Kategori
        </Text>
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-[#0066FF] shadow-sm shadow-blue-200"
          onPress={() =>
            router.push('/pelayanan-publik/aci/admin/kategori/create')
          }
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="mt-4 flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          className="ml-2 flex-1 text-base text-[#0B2347]"
          placeholder="Cari kategori..."
          value={search}
          onChangeText={onSearchChange}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
}

export default KategoriHeader;
