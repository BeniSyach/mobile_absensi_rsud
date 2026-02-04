import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciReporterName } from '@/components/pelayanan-publik-component/aci/reporter-name';
import { Text } from '@/components/ui/text';

import { useRekapTanggalLogic } from './use-rekap-tanggal-logic';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: null },
  { label: 'Pengajuan', value: 0 },
  { label: 'Diterima', value: 1 },
  { label: 'Diverifikasi', value: 2 },
  { label: 'Dalam Penanganan', value: 3 },
  { label: 'Selesai', value: 4 },
  { label: 'Ditolak', value: 5 },
];

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

const StatusFilter = ({ selected, onSelect }: any) => (
  <View>
    <Text className="mb-2 text-xs font-medium text-gray-500">
      Filter Status
    </Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {STATUS_OPTIONS.map((status) => {
        const isActive = selected === status.value;
        return (
          <TouchableOpacity
            key={String(status.value)}
            onPress={() => onSelect(status.value)}
            className={`mr-2 rounded-full border px-4 py-2 ${
              isActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

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
          Rekap Per Tanggal
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

const DateFilter = ({ label, date, setDate }: any) => {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View className="flex-1">
      <Text className="mb-1 text-xs font-medium text-gray-500">{label}</Text>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="flex-row items-center rounded-xl border border-gray-200 bg-white px-3 py-2.5"
      >
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text className="ml-2 text-sm text-[#0B2347]">
          {date.toLocaleDateString('id-ID')}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const StatisticCard = ({
  item,
  active,
  onPress,
}: {
  item: any;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mb-2 w-full rounded-2xl border p-4 shadow-sm ${
      active ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'
    }`}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="mr-3 size-10 items-center justify-center rounded-xl bg-blue-50">
          <Ionicons name="calendar" size={20} color="#3B82F6" />
        </View>
        <View>
          <Text className="text-sm font-bold text-[#0B2347]">
            {item.tanggal}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-lg font-black text-[#0B2347]">{item.total}</Text>
        <Text className="text-[10px] text-gray-400">Laporan</Text>
      </View>
    </View>
  </TouchableOpacity>
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

const EmptyState = () => (
  <View className="items-center p-20">
    <View className="mb-4 size-16 items-center justify-center rounded-full bg-gray-50">
      <Ionicons name="document-text-outline" size={32} color="#D1D5DB" />
    </View>
    <Text className="text-center font-medium text-gray-400">
      Tidak ada laporan pada periode/filter ini
    </Text>
  </View>
);

const ListSection = ({
  selectedDate,
  totalReports,
  reports,
  onReportPress,
  page,
  totalPages,
  onPageChange,
}: any) => {
  if (!selectedDate) {
    return (
      <View className="items-center p-10">
        <Text className="text-center font-medium text-gray-400">
          Silakan pilih salah satu tanggal di atas untuk melihat detail laporan
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Daftar Laporan
        </Text>
        <Text className="text-[10px] font-bold text-blue-500">
          {totalReports} Ditemukan
        </Text>
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
      {reports.length === 0 && <EmptyState />}
    </>
  );
};

const RekapContent = ({
  loading,
  reports,
  rekap,
  onReportPress,
  selectedDate,
  onDateSelect,
  page,
  totalPages,
  onPageChange,
  totalReports,
  search,
  onSearchChange,
}: any) => {
  if (loading && reports.length === 0) {
    return (
      <View className="p-20">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <View className="px-6">
      {rekap.length > 0 && (
        <View className="mb-6">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            Statistik Harian
          </Text>
          {rekap.map((item: any, idx: number) => (
            <StatisticCard
              key={idx}
              item={item}
              active={selectedDate === item.tanggal}
              onPress={() =>
                onDateSelect(
                  selectedDate === item.tanggal ? null : item.tanggal
                )
              }
            />
          ))}
        </View>
      )}

      {selectedDate && (
        <View className="mb-4">
          <SearchBar value={search} onChange={onSearchChange} />
        </View>
      )}

      <ListSection
        selectedDate={selectedDate}
        totalReports={totalReports}
        reports={reports}
        onReportPress={onReportPress}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </View>
  );
};

export default function RekapTanggal() {
  const router = useRouter();
  const logic = useRekapTanggalLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <RekapHeader onBack={() => router.back()} />

      <View className="px-6 py-4">
        <View className="mb-4 flex-row gap-4">
          <DateFilter
            label="Dari Tanggal"
            date={logic.startDate}
            setDate={logic.setStartDate}
          />
          <DateFilter
            label="Sampai Tanggal"
            date={logic.endDate}
            setDate={logic.setEndDate}
          />
        </View>

        <StatusFilter
          selected={logic.selectedStatus}
          onSelect={logic.setSelectedStatus}
        />
      </View>

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
        <RekapContent
          loading={logic.loading}
          reports={logic.laporan}
          rekap={logic.rekap}
          onReportPress={(id: any) =>
            router.push(`/pelayanan-publik/aci/admin/laporan/${id}`)
          }
          selectedDate={logic.selectedDateFilter}
          onDateSelect={logic.setSelectedDateFilter}
          page={logic.page}
          totalPages={logic.totalPages}
          onPageChange={logic.onPageChange}
          totalReports={logic.totalReports}
          search={logic.search}
          onSearchChange={logic.setSearch}
        />
      </ScrollView>
    </View>
  );
}
