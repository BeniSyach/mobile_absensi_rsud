/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  type BawahanRekapNilaiBawahan,
  type RekapKegiatanHarianResponse,
  useListBawahanInfinite,
} from '@/api';
import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import CardPengajuanCuti from '@/components/cuti-component/pengajuan-component/card-pengajuan-cuti';
import FormListPengajuan from '@/components/cuti-component/pengajuan-component/form-list-pengajuan';
import { EmptyListCuti, Text } from '@/components/ui';
import { getMessage } from '@/lib';
import { useDebouncedValue } from '@/utils/debaunce';

export const fakeRekapBawahanResponse: RekapKegiatanHarianResponse = {
  status: 200,
  message: 'Success',
  data: [
    {
      id: 1,
      nik: '123456789',
      nip: '198709102019031001',
      nama: 'Budi Santoso',
      pangkat: 'III/c',
      jabatan: 'Pengadministrasi Umum',
      jumlah_kegiatan: 12,
      rekap: {
        pending: 3,
        disetujui: 7,
        ditolak: 2,
      },
      kegiatan: [
        {
          id: 101,
          uraian_tugas: 'Menyusun laporan kegiatan harian',
          tgl_kinerja: '2025-02-22',
          waktu_kinerja: 120,
          nilai: 85,
          id_satuan: 1,
          nama_satuan: 'Menit',
          status: 1,
          created_at: '2025-02-22T10:00:00Z',
          updated_at: '2025-02-22T11:00:00Z',
        },
        {
          id: 102,
          uraian_tugas: 'Rapat koordinasi internal',
          tgl_kinerja: '2025-02-23',
          waktu_kinerja: 90,
          nilai: 90,
          id_satuan: 1,
          nama_satuan: 'Menit',
          status: 0,
          created_at: '2025-02-23T09:00:00Z',
          updated_at: '2025-02-23T09:30:00Z',
        },
      ],
    },
    {
      id: 2,
      nik: '987654321',
      nip: '199002052020122003',
      nama: 'Siti Rahmawati',
      pangkat: 'III/b',
      jabatan: 'Analis Kepegawaian',
      jumlah_kegiatan: 9,
      rekap: {
        pending: 1,
        disetujui: 8,
        ditolak: 0,
      },
      kegiatan: [
        {
          id: 201,
          uraian_tugas: 'Menginput data pegawai',
          tgl_kinerja: '2025-02-20',
          waktu_kinerja: 60,
          nilai: 95,
          id_satuan: 1,
          nama_satuan: 'Menit',
          status: 1,
          created_at: '2025-02-20T08:00:00Z',
          updated_at: '2025-02-20T08:30:00Z',
        },
      ],
    },
    {
      id: 3,
      nik: '192837465',
      nip: '198505162010011002',
      nama: 'Joko Prasetyo',
      pangkat: 'II/d',
      jabatan: 'Staff Keuangan',
      jumlah_kegiatan: 15,
      rekap: {
        pending: 5,
        disetujui: 6,
        ditolak: 4,
      },
      kegiatan: [
        {
          id: 301,
          uraian_tugas: 'Verifikasi dokumen pembayaran',
          tgl_kinerja: '2025-02-18',
          waktu_kinerja: 150,
          nilai: 80,
          id_satuan: 1,
          nama_satuan: 'Menit',
          status: 2,
          created_at: '2025-02-18T12:00:00Z',
          updated_at: '2025-02-18T12:30:00Z',
        },
      ],
    },
  ],
  pagination: {
    current_page: 1,
    last_page: 3,
  },
};

export default function Pengajuan() {
  const storedMessage = getMessage();
  const [filters, setFilters] = useState({
    search: '',
    kode_opd: '',
  });

  const debouncedSearch = useDebouncedValue(filters.search, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
    isLoading,
  } = useListBawahanInfinite({
    nik_atasan: storedMessage?.nik ?? '',
    limit: 30,
    search: debouncedSearch,
  });

  const USE_FAKE = true;

  const listKegiatanHarianBawahan = USE_FAKE
    ? fakeRekapBawahanResponse.data
    : (data?.pages.flatMap((page) => page.data) ?? []);

  const renderItem = React.useCallback(
    ({ item }: { item: BawahanRekapNilaiBawahan }) => (
      <CardPengajuanCuti dataCardbawahan={item} />
    ),
    []
  );

  if (error) {
    return (
      <Text className="text-red-500">
        Terjadi kesalahan:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </Text>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Pengajuan Cuti',
          headerBackTitle: 'Pengajuan Cuti',
          headerShown: false,
        }}
      />
      <CutiNavbar title="List Pengajuan Cuti" />
      <FormListPengajuan
        defaultValues={{
          search: filters.search,
          kode_opd: filters.kode_opd,
        }}
        onChange={(values) => {
          // hindari loop: update state hanya kalau beda
          setFilters((prev) =>
            JSON.stringify(prev) === JSON.stringify(values) ? prev : values
          );
        }}
      />
      <FlashList
        data={listKegiatanHarianBawahan}
        estimatedItemSize={60}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListEmptyComponent={<EmptyListCuti isLoading={isLoading} />}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text className="py-2 text-center">Memuat lebih banyak…</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
