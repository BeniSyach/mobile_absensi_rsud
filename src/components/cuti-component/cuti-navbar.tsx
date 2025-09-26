import { Bell, Menu, Settings } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui';

export const CutiNavbar = () => {
  return (
    <View className="flex-row items-center justify-between bg-[#20A0D8] px-4 py-3">
      {/* Kiri - Icon Menu */}
      <TouchableOpacity>
        <Menu size={28} color="black" />
      </TouchableOpacity>

      {/* Tengah - Judul */}
      <Text className="text-lg font-bold">Menu Utama</Text>

      {/* Kanan - Icon Bell & Settings */}
      <View className="flex-row items-center">
        <TouchableOpacity>
          <Bell size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-2">
          <Settings size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
