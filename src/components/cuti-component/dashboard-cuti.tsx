import { Briefcase, Calendar, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';

import { Text } from '@/components/ui';

const cards = [
  {
    id: 1,
    icon: User,
    title: 'Akumulasi Sisa Cuti Tahunan Anda',
    progress: 0.7,
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Total Hari Cuti yang Sudah Dipakai',
    progress: 0.4,
  },
  {
    id: 3,
    icon: Briefcase,
    title: 'Sisa Cuti Besar Anda',
    progress: 0.9,
  },
];

export const DashboardCuti = () => {
  return (
    <View className="p-4">
      <Text className="mb-2 text-lg font-bold text-black">Papan Pandu :</Text>
      {cards.map(({ id, icon: Icon, title, progress }) => (
        <View
          key={id}
          className="mb-3 w-full rounded-2xl border border-black bg-white p-4 shadow-lg"
        >
          <View className="flex-row items-start justify-between">
            {/* Kiri: Icon di atas + teks di bawah (rata kiri) */}
            <View className="flex-1 flex-col items-start">
              <Icon size={40} color="#20A0D8" />

              <Text className="mt-2 flex-1 text-base font-bold text-black">
                {title}
              </Text>
            </View>

            {/* Kanan: Progress Circle */}
            <View className="ml-4 items-center justify-center">
              <Progress.Circle
                size={70}
                progress={progress}
                color="#20A0D8"
                thickness={6}
                showsText={false}
                borderWidth={0}
                unfilledColor="#E5E7EB"
              />
              <Text className="absolute text-sm font-bold text-gray-700">
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
