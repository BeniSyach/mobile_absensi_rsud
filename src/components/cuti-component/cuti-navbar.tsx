import { Bell, Settings } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Image, Text } from '@/components/ui';

type CutiNavbarProps = {
  title: string;
};

export const CutiNavbar = ({ title }: CutiNavbarProps) => {
  return (
    <View className="flex-row items-center justify-between bg-[#20A0D8] px-4 py-3">
      {/* Kiri - Icon Menu */}
      <TouchableOpacity>
        <Image
          source={require('../../../assets/image/logo_cuti_icon.png')}
          className="size-6"
        />
      </TouchableOpacity>

      {/* Tengah - Judul */}
      <Text className="text-lg font-bold text-white">{title}</Text>

      {/* Kanan - Icon Bell & Settings */}
      <View className="flex-row items-center">
        <TouchableOpacity>
          <Bell size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-2">
          <Settings size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
