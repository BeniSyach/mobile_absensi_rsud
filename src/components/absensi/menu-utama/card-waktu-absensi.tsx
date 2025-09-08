import { Check, LogIn, LogOut, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  jamMasuk?: string;
  jamKeluar?: string;
};

const formatTanggal = (date: Date) => {
  const hariList = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  const bulanList = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const hari = hariList[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const bulan = bulanList[date.getMonth()];
  const yyyy = date.getFullYear();

  return `${hari}, ${dd} ${bulan} ${yyyy}`;
};

const formatWaktu = (date: Date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export default function CardWaktuAbsensi({ jamMasuk, jamKeluar }: Props) {
  const [waktuSekarang, setWaktuSekarang] = useState(formatWaktu(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktuSekarang(formatWaktu(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tanggalSekarang = formatTanggal(new Date());

  return (
    <View className="mx-4 my-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
      <View className="flex-row">
        {/* Kolom kiri */}
        <View className="flex-1 items-center border-r border-gray-300 pr-3">
          <Text className="mb-2 text-center text-sm font-bold text-gray-800">
            {tanggalSekarang}
          </Text>
          <Text className="text-center text-2xl font-bold text-[#20A0D8]">
            {waktuSekarang}
          </Text>
        </View>

        {/* Kolom kanan */}
        <View className="flex-1 pl-3">
          {/* Row 1: Icons */}
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-1">
              <LogIn size={20} color="#20A0D8" />
              <Text className="text-sm font-semibold text-black">Masuk</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <LogOut size={20} color="#F87171" />
              <Text className="text-sm font-semibold text-black">Keluar</Text>
            </View>
          </View>

          {/* Row 2: Jam masuk/keluar */}
          <View className="flex-row items-center justify-between">
            {/* Jam Masuk */}
            {jamMasuk ? (
              <Check size={24} color="green" />
            ) : (
              <X size={24} color="red" />
            )}

            {/* Jam Keluar */}
            {jamKeluar ? (
              <Check size={24} color="green" />
            ) : (
              <X size={24} color="red" />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
