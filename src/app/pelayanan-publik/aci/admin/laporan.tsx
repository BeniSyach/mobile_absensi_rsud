import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciReporterName } from '@/components/pelayanan-publik-component/aci/reporter-name';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import { getReportImageSource } from '../aci-service';
import { useLaporanLogic } from './laporan/use-laporan-logic';

export const StatusBadge = ({ status }: { status: string | number }) => {
  const getStatusConfig = (s: string | number = '0') => {
    const safeStatus = (s === null || s === undefined ? '0' : s)
      .toString()
      .toLowerCase();

    if (safeStatus === '0' || safeStatus === 'pending') {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        label: 'Pengajuan',
      };
    }
    if (safeStatus === '1') {
      return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Diterima' };
    }
    if (safeStatus === '2') {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        label: 'Diverifikasi',
      };
    }
    if (safeStatus === '3' || safeStatus === 'diproses') {
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        label: 'Dalam Penanganan',
      };
    }
    if (safeStatus === '4' || safeStatus === 'selesai') {
      return { bg: 'bg-green-50', text: 'text-green-600', label: 'Selesai' };
    }
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

const ReportCardImage = ({ item }: { item: any }) => {
  const source = getReportImageSource(item);
  return source ? (
    <Image
      source={source}
      className="mr-4 size-20 rounded-xl"
      contentFit="cover"
    />
  ) : (
    <View className="mr-4 size-20 items-center justify-center rounded-xl bg-gray-50">
      <Ionicons name="image-outline" size={32} color="#D1D5DB" />
    </View>
  );
};

const ReportCardContent = ({
  item,
  categoryMap,
}: {
  item: any;
  categoryMap?: Record<number, string>;
}) => (
  <View className="flex-1">
    <View className="mb-1 flex-row items-center justify-between">
      <Text className="text-xs font-semibold text-[#0066FF]">
        {item.kategori?.nm_kategori ||
          item.kategori?.nama_kategori ||
          item.kategori?.nama ||
          (categoryMap
            ? categoryMap[item.kategori_id] ||
              categoryMap[item.kategori_laporan_id]
            : '') ||
          'Kategori'}
      </Text>
      <StatusBadge status={item.status ?? item.status_laporan} />
    </View>

    <Text
      className="mb-0.5 text-base font-bold text-[#0B2347]"
      numberOfLines={1}
    >
      {item.judul || item.deskripsi || `Laporan #${item.id}`}
    </Text>

    {item.deskripsi && (
      <Text
        className="mb-2 text-xs leading-relaxed text-gray-500"
        numberOfLines={2}
      >
        {item.deskripsi}
      </Text>
    )}

    <View className="mb-1.5 flex-row items-center">
      <Ionicons name="person-circle-outline" size={12} color="#6B7280" />
      <AciReporterName
        userId={item.user_id}
        item={item}
        className="ml-1 text-[11px] text-gray-500"
      />
    </View>

    <View className="mb-2 flex-row items-center">
      <Ionicons name="location-outline" size={12} color="#9CA3AF" />
      <Text className="ml-1 flex-1 text-[11px] text-gray-400" numberOfLines={1}>
        {item.alamat || 'Lokasi tidak tersedia'}
      </Text>
    </View>

    <Text className="text-[10px] text-gray-400">
      {new Date(item.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </Text>
  </View>
);

const AdminReportCard = ({
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
      <ReportCardImage item={item} />
      <ReportCardContent item={item} categoryMap={categoryMap} />
    </View>
  </TouchableOpacity>
);

const LaporanHeader = ({
  search,
  handleSearch,
}: {
  search: string;
  handleSearch: (text: string) => void;
}) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">
        Laporan Masyarakat
      </Text>
      <View className="size-10" />
    </View>

    <View className="mt-4 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <Ionicons name="search" size={20} color="#9CA3AF" />
      <TextInput
        placeholder="Cari laporan..."
        className="ml-2 flex-1 text-base text-[#0B2347]"
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={handleSearch}
      />
    </View>
  </View>
);

export default function AdminLaporanList() {
  const {
    reports,
    loading,
    search,
    refreshing,
    page,
    handleSearch,
    handleLoadMore,
    onRefresh,
    fetchReports,
    categoryMap,
  } = useLaporanLogic();

  useFocusEffect(
    useCallback(() => {
      fetchReports(1, search);
    }, [fetchReports, search])
  );

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <LaporanHeader search={search} handleSearch={handleSearch} />

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AdminReportCard
            item={item}
            categoryMap={categoryMap}
            onPress={() =>
              router.push(`/pelayanan-publik/aci/admin/laporan/${item.id}`)
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
              <Text className="text-gray-400">Tidak ada laporan ditemukan</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <View className="py-4">
              <ActivityIndicator color="#0066FF" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
