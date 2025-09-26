import { Calendar } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui';

const riwayatCuti = [
  {
    id: 1,
    jenis: 'Cuti Tahunan',
    tanggalAwal: '01-09-2025',
    tanggalAkhir: '05-09-2025',
    alasan: 'Urusan pribadi',
    status: 'tertunda', // "diterima" | "ditolak"
  },
  {
    id: 2,
    jenis: 'Cuti Tahunan',
    tanggalAwal: '12-09-2025',
    tanggalAkhir: '15-09-2025',
    alasan: 'Acara keluarga',
    status: 'diterima',
  },
  {
    id: 3,
    jenis: 'Cuti Tahunan',
    tanggalAwal: '20-09-2025',
    tanggalAkhir: '22-09-2025',
    alasan: 'Kesehatan',
    status: 'ditolak',
  },
];

const getBadgeStyle = (status: string) => {
  switch (status) {
    case 'diterima':
      return 'bg-green-100 text-green-700 border border-green-400';
    case 'ditolak':
      return 'bg-red-100 text-red-700 border border-red-400';
    case 'tertunda':
    default:
      return 'bg-yellow-100 text-yellow-700 border border-yellow-400';
  }
};

export const ListRiwayatCuti = () => {
  return (
    <View className="p-4">
      {riwayatCuti.map(
        ({ id, jenis, tanggalAwal, tanggalAkhir, alasan, status }) => (
          <TouchableOpacity
            key={id}
            className="mb-3 w-full rounded-2xl border border-black bg-white p-4 shadow-lg"
          >
            <View className="flex-row items-center justify-between">
              {/* Kiri: Icon + Detail */}
              <View className="flex-1 flex-row items-center">
                {/* Icon */}
                <View className="w-10 items-center justify-center">
                  <Calendar size={32} color="#20A0D8" />
                </View>

                {/* Detail teks */}
                <View className="ml-3 flex-1">
                  <Text className="text-base font-bold text-[#20A0D8]">
                    {jenis}
                  </Text>
                  <Text className="text-sm font-semibold text-black">
                    {tanggalAwal} - {tanggalAkhir}
                  </Text>
                  <Text className="text-sm text-gray-600">{alasan}</Text>
                </View>
              </View>

              {/* Kanan: Status + Arrow (sejajar horizontal) */}
              <View className="flex-row items-center space-x-2">
                <View
                  className={`rounded-full px-3 py-1 ${getBadgeStyle(status)}`}
                >
                  <Text className="text-xs font-semibold capitalize">
                    {status}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-gray-500">
                  {'   >'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};
