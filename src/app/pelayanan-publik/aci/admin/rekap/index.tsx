import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';

const MenuHeader = ({ onBack }: { onBack: () => void }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={onBack}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <View className="mr-10 flex-1 items-center">
        <Text className="text-lg font-bold text-[#0B2347]">Rekap Laporan</Text>
      </View>
    </View>
  </View>
);

const MenuOption = ({ title, subtitle, icon, color, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-4 flex-row items-center rounded-2xl bg-white p-4 shadow-sm shadow-gray-100 active:bg-gray-50"
  >
    <View
      className="mr-4 size-12 items-center justify-center rounded-xl"
      style={{ backgroundColor: `${color}15` }}
    >
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View className="flex-1">
      <Text className="text-base font-bold text-[#0B2347]">{title}</Text>
      <Text className="text-xs text-gray-500">{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

export default function RekapMenu() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <MenuHeader onBack={() => router.back()} />

      <View className="flex-1 p-6">
        <Text className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">
          Pilih Jenis Rekap
        </Text>

        <MenuOption
          title="Rekap Per Tanggal"
          subtitle="Lihat statistik laporan berdasarkan periode tanggal"
          icon="calendar"
          color="#3B82F6"
          onPress={() =>
            router.push('/pelayanan-publik/aci/admin/rekap/rekap-tanggal')
          }
        />

        <MenuOption
          title="Rekap Per Status"
          subtitle="Lihat statistik laporan akumulasi status"
          icon="stats-chart"
          color="#10B981"
          onPress={() =>
            router.push('/pelayanan-publik/aci/admin/rekap/rekap-status')
          }
        />

        <MenuOption
          title="Rekap Per Kecamatan"
          subtitle="Lihat statistik laporan per kecamatan"
          icon="map"
          color="#F59E0B"
          onPress={() =>
            router.push('/pelayanan-publik/aci/admin/rekap/rekap-kecamatan')
          }
        />
      </View>
    </View>
  );
}
