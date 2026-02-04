import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciBottomNavigation } from '@/components/pelayanan-publik-component/aci/bottom-navigation';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import { getReportImageSource } from './aci-service';
import { useRiwayatLogic } from './use-riwayat-logic';

const SearchBar = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View className="px-4 pb-4">
    <View className="flex-row items-center rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <Ionicons name="search-outline" size={20} color="#9CA3AF" />
      <TextInput
        className="ml-3 flex-1 font-inter text-base text-gray-800"
        placeholder="Cari laporan..."
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const StatusBadge = ({ status }: { status: string | number }) => {
  const getStatusConfig = (s: string | number = '0') => {
    const safeStatus = (s === null || s === undefined ? '0' : s)
      .toString()
      .toLowerCase();

    // 0: Pengajuan (Draft/Submission)
    if (safeStatus === '0' || safeStatus === 'pending') {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        label: 'Pengajuan',
      };
    }
    // 1: Diterima (Received/Accepted)
    if (safeStatus === '1') {
      return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Diterima' };
    }
    // 2: Diverifikasi (Verified)
    if (safeStatus === '2') {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        label: 'Diverifikasi',
      };
    }
    // 3: Penanganan (Handling/In Progress)
    if (safeStatus === '3' || safeStatus === 'diproses') {
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        label: 'Ditangani',
      };
    }
    // 4: Selesai (Completed)
    if (safeStatus === '4' || safeStatus === 'selesai') {
      return { bg: 'bg-green-50', text: 'text-green-600', label: 'Selesai' };
    }
    // 5: Ditolak (Rejected)
    if (safeStatus === '5' || safeStatus === 'ditolak') {
      return { bg: 'bg-red-50', text: 'text-red-600', label: 'Ditolak' };
    }

    return {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      label: safeStatus || 'N/A',
    };
  };

  const config = getStatusConfig(status);

  return (
    <View className={`rounded-full px-3 py-1 ${config.bg}`}>
      <Text className={`text-[10px] font-bold ${config.text}`}>
        {config.label.toUpperCase()}
      </Text>
    </View>
  );
};

const ReportImage = ({ item }: { item: any }) => {
  const source = getReportImageSource(item);
  if (source) {
    return (
      <Image
        source={source}
        className="mr-4 size-20 rounded-xl"
        contentFit="cover"
      />
    );
  }
  return (
    <View className="mr-4 size-20 items-center justify-center rounded-xl bg-gray-50">
      <Ionicons name="image-outline" size={32} color="#D1D5DB" />
    </View>
  );
};

const getCategoryName = (item: any, categoryMap?: Record<number, string>) => {
  return (
    item.kategori?.nm_kategori ||
    item.kategori?.nama_kategori ||
    item.kategori?.nama ||
    (categoryMap
      ? categoryMap[item.kategori_id] || categoryMap[item.kategori_laporan_id]
      : '') ||
    'Kategori'
  );
};

const ReportCard = ({
  item,
  onPress,
  categoryMap,
}: {
  item: any;
  onPress: () => void;
  categoryMap?: Record<number, string>;
}) => (
  <TouchableOpacity
    className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View className="flex-row p-4">
      <ReportImage item={item} />

      <View className="flex-1">
        <View className="mb-1 flex-row items-center justify-between">
          <Text
            className="flex-1 text-base font-bold text-[#0B2347]"
            numberOfLines={1}
          >
            {getCategoryName(item, categoryMap)}
          </Text>
          <StatusBadge status={item.status ?? item.status_laporan} />
        </View>

        <Text className="mb-2 text-xs text-gray-500" numberOfLines={1}>
          {item.deskripsi}
        </Text>

        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={14} color="#9CA3AF" />
          <Text className="ml-1 flex-1 text-xs text-gray-400" numberOfLines={1}>
            {item.alamat || item.lokasi || 'Lokasi tidak tersedia'}
          </Text>
        </View>

        <Text className="mt-2 text-[10px] text-gray-400">
          {new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const LoadingRiwayat = () => (
  <View className="flex-1 items-center justify-center">
    <ActivityIndicator size="large" color="#0066FF" />
    <Text className="mt-4 text-gray-500">Memuat riwayat...</Text>
  </View>
);

const EmptyRiwayat = ({
  onCreateReport,
  isSearching,
}: {
  onCreateReport: () => void;
  isSearching?: boolean;
}) => (
  <View className="mt-20 items-center justify-center">
    <View className="mb-4 rounded-full bg-blue-50 p-6">
      <Ionicons
        name={isSearching ? 'search-outline' : 'document-text-outline'}
        size={64}
        color="#0066FF"
      />
    </View>
    <Text className="text-lg font-bold text-[#0B2347]">
      {isSearching ? 'Laporan Tidak Ditemukan' : 'Belum Ada Laporan'}
    </Text>
    <Text className="mt-2 px-8 text-center text-gray-500">
      {isSearching
        ? 'Coba gunakan kata kunci lain untuk mencari laporan Anda.'
        : 'Anda belum pernah mengirimkan laporan masalah.'}
    </Text>
    {!isSearching && (
      <TouchableOpacity
        onPress={onCreateReport}
        className="mt-6 rounded-full bg-[#0066FF] px-8 py-3"
      >
        <Text className="font-bold text-white">Buat Laporan Sekarang</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default function RiwayatPage() {
  const logic = useRiwayatLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Riwayat Laporan',
          headerTitleStyle: { fontWeight: 'bold', color: '#0B2347' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerTintColor: '#0B2347',
        }}
      />

      <View className="flex-1">
        <SearchBar value={logic.search} onChangeText={logic.setSearch} />

        {logic.loading ? (
          <LoadingRiwayat />
        ) : (
          <FlatList
            data={logic.reports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ReportCard
                item={item}
                categoryMap={logic.categoryMap}
                onPress={() =>
                  logic.router.push(`/pelayanan-publik/aci/riwayat/${item.id}`)
                }
              />
            )}
            contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
            refreshControl={
              <RefreshControl
                refreshing={logic.refreshing}
                onRefresh={logic.onRefresh}
              />
            }
            ListEmptyComponent={
              <EmptyRiwayat
                onCreateReport={() =>
                  logic.router.replace('/pelayanan-publik/aci/lapor')
                }
                isSearching={logic.search.length > 0}
              />
            }
          />
        )}
      </View>

      <AciBottomNavigation />
    </View>
  );
}
