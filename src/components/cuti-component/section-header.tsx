import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui';

export const SectionHeader = () => {
  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between ">
        {/* Judul */}
        <Text className="text-lg font-bold text-black">
          Catatan Riwayat Cuti
        </Text>

        {/* Badge Outline */}
        <TouchableOpacity className="rounded-full border border-[#20A0D8] px-4 py-2">
          <Text className="text-sm font-bold text-[#20A0D8]">
            Lihat Semua →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
