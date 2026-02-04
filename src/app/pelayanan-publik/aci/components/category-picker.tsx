import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface Category {
  id: string | number;
  nm_kategori?: string;
  nama_kategori?: string;
}

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
  loading?: boolean;
}

export function CategoryPicker({
  categories,
  selectedId,
  onSelect,
  loading,
}: CategoryPickerProps) {
  return (
    <View>
      <Text className="mb-2 ml-1 text-sm font-bold text-[#0B2347]">
        Kategori
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {loading ? (
          <ActivityIndicator size="small" color="#0066FF" />
        ) : (
          categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              className={`rounded-full border px-4 py-2 ${
                selectedId === cat.id
                  ? 'border-[#0066FF] bg-[#0066FF]'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedId === cat.id ? 'text-white' : 'text-gray-600'
                }`}
              >
                {cat.nm_kategori || cat.nama_kategori}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}

export default function Ignored() {
  return null;
}
