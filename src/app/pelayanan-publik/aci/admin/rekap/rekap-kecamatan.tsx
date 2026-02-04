import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciReporterName } from '@/components/pelayanan-publik-component/aci/reporter-name';
import { Text } from '@/components/ui/text';

import { useRekapKecamatanLogic } from './use-rekap-kecamatan-logic';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: null },
  { label: 'Pengajuan', value: 0 },
  { label: 'Diterima', value: 1 },
  { label: 'Diverifikasi', value: 2 },
  { label: 'Dalam Penanganan', value: 3 },
  { label: 'Selesai', value: 4 },
  { label: 'Ditolak', value: 5 },
];

const RekapHeader = ({ onBack }: { onBack: () => void }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={onBack}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <View className="mr-10 flex-1 items-center">
        <Text className="text-lg font-bold text-[#0B2347]">
          Rekap Per Kecamatan
        </Text>
      </View>
    </View>
  </View>
);

const ReportMiniCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-3 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 p-3"
  >
    <View className="mr-3 size-10 items-center justify-center rounded-lg bg-white shadow-sm">
      <Ionicons name="document-text" size={18} color="#0066FF" />
    </View>
    <View className="flex-1">
      <Text className="text-sm font-bold leading-tight text-[#0B2347]">
        {item.judul || item.deskripsi || `Laporan #${item.id}`}
      </Text>
      {item.judul && item.deskripsi && (
        <Text
          className="mt-0.5 text-[10px] leading-tight text-gray-400"
          numberOfLines={1}
        >
          {item.deskripsi}
        </Text>
      )}
      <Text className="mt-1 text-[10px] leading-tight text-gray-500">
        <AciReporterName userId={item.user_id} item={item} /> •{' '}
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
  </TouchableOpacity>
);

const KecamatanFilter = ({ list, selected, onSelect }: any) => (
  <>
    <Text className="mb-2 text-sm font-bold text-[#0B2347]">
      Pilih Kecamatan
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
      {list.map((kec: any) => (
        <TouchableOpacity
          key={kec.id}
          onPress={() => onSelect(kec.id)}
          className={`mr-2 rounded-full border px-4 py-2 ${
            selected === kec.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <Text
            className={`text-xs font-medium ${selected === kec.id ? 'text-blue-600' : 'text-gray-600'}`}
          >
            {kec.nm_kecamatan || kec.nama_kecamatan || kec.name || kec.nama}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </>
);

const StatusFilter = ({ selected, onSelect }: any) => (
  <>
    <Text className="mb-2 text-xs font-medium text-gray-500">
      Filter Status
    </Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {STATUS_OPTIONS.map((status) => (
        <TouchableOpacity
          key={String(status.value)}
          onPress={() => onSelect(status.value)}
          className={`mr-2 rounded-full border px-4 py-2 ${
            selected === status.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <Text
            className={`text-xs font-medium ${selected === status.value ? 'text-blue-600' : 'text-gray-600'}`}
          >
            {status.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </>
);

const SearchBar = ({ value, onChange }: any) => (
  <View className="mb-4">
    <View className="flex-row items-center rounded-2xl border border-gray-100 bg-white px-4 py-2 shadow-sm shadow-gray-100">
      <Ionicons name="search" size={20} color="#9CA3AF" />
      <TextInput
        placeholder="Cari laporan..."
        value={value}
        onChangeText={onChange}
        className="ml-2 flex-1 text-sm text-[#0B2347]"
        placeholderTextColor="#9CA3AF"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')}>
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const FilterSection = ({
  kecamatanList,
  selectedKecamatanId,
  onSelectKecamatan,
  selectedStatus,
  onSelectStatus,
  search,
  setSearch,
}: any) => (
  <View className="p-6">
    <KecamatanFilter
      list={kecamatanList}
      selected={selectedKecamatanId}
      onSelect={onSelectKecamatan}
    />
    {selectedKecamatanId && (
      <>
        <StatusFilter selected={selectedStatus} onSelect={onSelectStatus} />
        <View className="mt-4">
          <SearchBar value={search} onChange={setSearch} />
        </View>
      </>
    )}
  </View>
);

const PageNumberButton = ({ page, currentPage, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mx-1 size-8 items-center justify-center rounded-lg border ${
      page === currentPage
        ? 'border-blue-600 bg-blue-600'
        : 'border-gray-200 bg-white'
    }`}
  >
    <Text
      className={`text-xs font-bold ${
        page === currentPage ? 'text-white' : 'text-gray-600'
      }`}
    >
      {page}
    </Text>
  </TouchableOpacity>
);

const Pagination = ({ page, totalPages, onPageChange }: any) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <View className="mb-6 mt-4 flex-row items-center justify-center">
      <TouchableOpacity
        onPress={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`mr-2 flex-row items-center rounded-lg border border-gray-200 bg-white px-3 py-2 ${
          page === 1 ? 'opacity-50' : ''
        }`}
      >
        <Ionicons name="chevron-back" size={16} color="#374151" />
        <Text className="ml-1 text-xs font-medium text-gray-600">Prev</Text>
      </TouchableOpacity>
      <View className="flex-row">
        {getVisiblePages().map((p) => (
          <PageNumberButton
            key={p}
            page={p}
            currentPage={page}
            onPress={() => onPageChange(p)}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`ml-2 flex-row items-center rounded-lg border border-gray-200 bg-white px-3 py-2 ${
          page === totalPages ? 'opacity-50' : ''
        }`}
      >
        <Text className="mr-1 text-xs font-medium text-gray-600">Next</Text>
        <Ionicons name="chevron-forward" size={16} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};

const RekapContent = ({
  loading,
  reports,
  total,
  onReportPress,
  page,
  totalPages,
  onPageChange,
}: any) => {
  if (loading) {
    return (
      <View className="p-20">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  if (reports.length === 0 && page === 1) {
    return (
      <View className="items-center p-20">
        <View className="mb-4 size-16 items-center justify-center rounded-full bg-gray-50">
          <Ionicons name="map-outline" size={32} color="#D1D5DB" />
        </View>
        <Text className="text-center font-medium text-gray-400">
          Belum ada data untuk filter ini
        </Text>
      </View>
    );
  }

  return (
    <View className="px-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Hasil Laporan
        </Text>
        <Text className="text-xs font-bold text-blue-500">Total: {total}</Text>
      </View>

      {reports.map((r: any) => (
        <ReportMiniCard
          key={r.id}
          item={r}
          onPress={() => onReportPress(r.id)}
        />
      ))}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </View>
  );
};

export default function RekapKecamatan() {
  const router = useRouter();
  const logic = useRekapKecamatanLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <RekapHeader onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={logic.loading}
            onRefresh={logic.refresh}
          />
        }
      >
        <FilterSection
          kecamatanList={logic.kecamatanList}
          selectedKecamatanId={logic.selectedKecamatanId}
          onSelectKecamatan={logic.setSelectedKecamatanId}
          selectedStatus={logic.selectedStatus}
          onSelectStatus={logic.setSelectedStatus}
          search={logic.search}
          setSearch={logic.setSearch}
        />

        {logic.selectedKecamatanId && (
          <RekapContent
            loading={logic.loading}
            reports={logic.laporan}
            total={logic.total}
            onReportPress={(id: any) =>
              router.push(`/pelayanan-publik/aci/admin/laporan/${id}`)
            }
            page={logic.page}
            totalPages={logic.totalPages}
            onPageChange={logic.onPageChange}
          />
        )}
      </ScrollView>
    </View>
  );
}
