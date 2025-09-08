/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { LogIn, LogOut } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { type AbsenMasuk } from '@/api';

interface dataProps {
  data: AbsenMasuk[];
  isPending: boolean;
  isError: boolean;
}

export default function DaftarAbsensiCard({
  data,
  isPending,
  isError,
}: dataProps) {
  const router = useRouter();

  // Memisahkan tanggal dan jam dari waktu_masuk dan waktu_pulang
  const formatTime = (datetime?: string) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // tampilkan detik
      hour12: false, // format 24 jam
    }); // output: "08:05:12"
  };

  const formatDate = (datetime?: string) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    // Format: 25 Agustus 2025
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isPending) {
    return (
      <View className="m-4 items-center justify-center rounded-xl bg-gray-100 p-6">
        <Progress.Circle
          size={40}
          indeterminate={true}
          color="#20A0D8"
          borderWidth={2}
        />
        <Text className="mt-2 text-gray-500">Loading data absensi...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="m-4 items-center justify-center rounded-xl bg-red-100 p-4">
        <Text className="text-red-600">
          Terjadi kesalahan saat mengambil data!
        </Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="m-4 items-center justify-center rounded-xl bg-gray-100 p-4">
        <Text className="text-gray-500">Belum ada data absensi.</Text>
      </View>
    );
  }

  return (
    <View className="mt-4 px-4">
      {/* Card utama */}
      <View className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-800">
            Daftar Absensi
          </Text>
          <TouchableOpacity onPress={() => router.push('/list-absensi')}>
            <Text className="text-sm font-medium text-blue-500">
              Lihat semua
            </Text>
          </TouchableOpacity>
        </View>

        {/* List absensi */}
        <ScrollView
          style={{ maxHeight: 150 }}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          {data.map((item) => (
            <View
              key={item.id}
              className="mb-4 rounded-xl border border-gray-200  bg-gray-50 p-3"
            >
              <View className="absolute inset-y-0 left-0 w-2 rounded-l-xl bg-blue-500" />
              {/* Header tanggal + icon masuk/pulang */}
              <View className="mb-2 flex-row ">
                <Text className="flex-1 text-xs font-semibold text-gray-700">
                  {formatDate(item.waktu_masuk)}
                </Text>

                {/* Masuk */}
                <View className="flex-1 flex-row items-center justify-center space-x-1 border-x">
                  <LogIn size={14} color="#16A34A" />
                  <Text className="text-center text-xs text-black">Masuk</Text>
                </View>

                {/* Pulang */}
                <View className="flex-1 flex-row items-center justify-center space-x-1">
                  <LogOut size={14} color="#DC2626" />
                  <Text className="text-center text-xs text-black">Pulang</Text>
                </View>
              </View>

              {/* Row 1: Shift / Masuk / Pulang */}
              <View className="flex-row   pt-2">
                <Text className="flex-1 border-r  pr-2 text-xs text-gray-700">
                  {item.nama_shift}
                </Text>

                {/* Masuk sebagai badge biru */}
                <View className="flex-1 items-center justify-center border-r  px-2">
                  <Text className="rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                    {formatTime(item.waktu_masuk)}
                  </Text>
                </View>

                {/* Pulang sebagai badge biru */}
                <View className="flex-1 items-center justify-center pl-2">
                  <Text className="rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                    {formatTime(item.absen_pulang[0]?.waktu_pulang)}
                  </Text>
                </View>
              </View>

              {/* Row 2: Waktu kerja / ket masuk / ket pulang */}
              <View className="flex-row   pt-1">
                <Text className="flex-1 border-r  pr-2 text-[11px] text-gray-500">
                  {item.nama_hari_waktu_kerja || '-'}
                </Text>
                <Text className="flex-1 border-r  px-2 text-center text-[11px] text-gray-500">
                  {item.keterangan || '-'}
                </Text>
                <Text className="flex-1 pl-2 text-center text-[11px] text-gray-500">
                  {item.absen_pulang[0]?.keterangan || '-'}
                </Text>
              </View>

              {/* Row 3: Waktu update */}
              <View className="mt-2 border-t border-gray-200 pt-1">
                <Text className="text-[11px] text-gray-400">
                  Waktu Kerja :{' '}
                  {item.jam_mulai_waktu_kerja
                    ? item.jam_mulai_waktu_kerja
                    : '--:--:--'}{' '}
                  {'    '}-{'    '}
                  {item.jam_selesai_waktu_kerja
                    ? item.jam_selesai_waktu_kerja
                    : '--:--:--'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
