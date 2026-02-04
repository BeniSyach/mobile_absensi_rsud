import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';

import { type AciKategori } from '../../../aci-service';

interface KategoriItemProps {
  item: AciKategori;
}

export function KategoriItem({ item }: KategoriItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="mb-3 rounded-xl bg-white p-4 shadow-sm shadow-gray-100"
      onPress={() =>
        router.push(`/pelayanan-publik/aci/admin/kategori/${item.id}`)
      }
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="size-10 items-center justify-center rounded-full bg-red-50">
            <Ionicons name="list" size={20} color="#DC2626" />
          </View>
          <View>
            <Text className="font-bold text-[#0B2347]">
              {item.nm_kategori ||
                item.nama_kategori ||
                (item as any).nama ||
                (item as any).name ||
                'Tanpa Nama'}
            </Text>
            <Text className="text-xs text-gray-500">ID: {item.id}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

export default KategoriItem;
