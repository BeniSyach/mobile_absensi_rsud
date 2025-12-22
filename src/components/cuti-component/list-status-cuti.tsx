import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { type PengajuanCutiItem } from '@/api/cuti';
import { Image, Text } from '@/components/ui';

/* ================== Types ================== */

type StatusCuti = 1 | 2 | 3;

interface Props {
  data: PengajuanCutiItem;
}

/* ================== Helpers ================== */

const getBadgeStyle = (status: StatusCuti) => {
  switch (status) {
    case 1:
      return 'bg-[#479F76] border-[#479F76]';
    case 2:
      return 'bg-[#FF0D0D] border-[#FF0D0D]';
    default:
      return 'bg-[#FD9843] border-[#FD9843]';
  }
};

/* ================== Component ================== */

export const ListStatusCuti = ({ data }: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="mb-3 w-full rounded-2xl border border-gray-400 bg-white p-4 shadow-lg"
      onPress={() =>
        router.push(`/cuti/status-cuti/detail-status-cuti/${data.id}`)
      }
    >
      <View className="flex-row items-center justify-between">
        {/* Kiri */}
        <View className="flex-1 flex-row items-center">
          <View className="w-10 items-center justify-center">
            <Image
              source={require('../../../assets/image/status_cuti.png')}
              className="size-14"
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="pb-2 text-xl font-bold text-black">
              {data.kode_jenis_cuti}
            </Text>

            <Text className="pb-2 text-sm font-semibold text-gray-600">
              {data.tanggal_mulai} - {data.tanggal_selesai}
            </Text>

            <Text className="text-sm text-gray-600">{data.alasan}</Text>
          </View>
        </View>

        {/* Kanan */}
        <View className="flex-row items-center space-x-2">
          <View
            className={`rounded-full border px-3 py-1 ${getBadgeStyle(
              data.status as StatusCuti
            )}`}
          >
            <Text className="text-sm font-bold capitalize text-white">
              {data.status}
            </Text>
          </View>

          <Text className="text-lg font-bold text-gray-500">{'>'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
