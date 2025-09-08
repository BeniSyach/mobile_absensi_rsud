/* eslint-disable max-lines-per-function */
import React from 'react';
import * as Progress from 'react-native-progress'; // pastikan install react-native-progress

import { Text, View } from '@/components/ui';

type Props = {
  totalMasuk?: number;
  totalPulang?: number;
  progress?: number; // misal 0.7 untuk 70%
  total_durasi_kerja?: string;
  isPending: boolean;
  isError: boolean;
};

export default function CardRekapAbsensi({
  totalMasuk = 0,
  totalPulang = 0,
  progress = 0,
  total_durasi_kerja = '0',
  isPending,
  isError,
}: Props) {
  // Jika error
  if (isError) {
    return (
      <View className="mx-4 my-2 items-center rounded-2xl border border-gray-200 bg-red-100 p-5 shadow-lg">
        <Text className="text-center text-lg font-bold text-red-600">
          Gagal memuat data absensi
        </Text>
      </View>
    );
  }

  const progressValue = progress / 100;

  return (
    <View className="mx-4 my-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
      {/* Judul */}
      <Text className="mb-4 text-center text-lg font-bold text-[#20A0D8]">
        Rekapitulasi Absensi
      </Text>

      {/* Tiga kolom */}
      <View className="mb-4 flex-row justify-between">
        {/* Masuk */}
        <View className="flex-1 items-center border-r border-gray-300">
          <Text className="text-sm text-black">Total Masuk</Text>
          {isPending ? (
            <Progress.Bar
              progress={0.5} // nilai tetap untuk animasi
              width={50} // lebar bar kecil di tempat angka
              color="#20A0D8"
              height={8}
              borderRadius={4}
              indeterminate={true} // animasi bergerak terus
            />
          ) : (
            <Text className="text-xl font-bold text-black">{totalMasuk}</Text>
          )}
        </View>

        {/* Pulang */}
        <View className="flex-1 items-center border-r border-gray-300">
          <Text className="text-sm text-black">Total Pulang</Text>
          {isPending ? (
            <Progress.Bar
              progress={0.5} // nilai tetap untuk animasi
              width={50} // lebar bar kecil di tempat angka
              color="#20A0D8"
              height={8}
              borderRadius={4}
              indeterminate={true} // animasi bergerak terus
            />
          ) : (
            <Text className="text-xl font-bold text-black">{totalPulang}</Text>
          )}
        </View>

        {/* Absen */}
        <View className="flex-1 items-center">
          <Text className="text-sm text-black">Total Waktu Kerja</Text>
          <Text className="text-xl font-bold text-black">
            {total_durasi_kerja}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mt-2">
        <Progress.Bar
          progress={progressValue}
          width={null}
          color="#20A0D8"
          height={12}
          borderRadius={6}
        />
        <Text className="mt-2 text-center text-sm font-semibold text-gray-700">
          {Math.round(progressValue * 100)} %
        </Text>
      </View>
    </View>
  );
}
