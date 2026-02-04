import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';

import { useDummyLogic } from './use-dummy-logic';

const DummyHeader = ({ onBack }: { onBack: () => void }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={onBack}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Generator Dummy</Text>
      <View className="size-10" />
    </View>
  </View>
);

const GenerateCard = ({
  count,
  loading,
  onPress,
}: {
  count: number;
  loading: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    disabled={loading}
    onPress={onPress}
    className="mb-4 flex-row items-center justify-between rounded-2xl bg-white p-5 shadow-sm shadow-gray-100"
  >
    <View className="flex-row items-center">
      <View className="mr-4 size-12 items-center justify-center rounded-xl bg-blue-50">
        <Ionicons name="documents-outline" size={24} color="#0066FF" />
      </View>
      <View>
        <Text className="text-lg font-bold text-[#0B2347]">
          {count} Laporan
        </Text>
        <Text className="text-xs text-gray-400">
          Buat {count} data statistik
        </Text>
      </View>
    </View>
    {loading ? (
      <ActivityIndicator color="#0066FF" />
    ) : (
      <Ionicons name="add-circle" size={28} color="#0066FF" />
    )}
  </TouchableOpacity>
);

export default function AdminDummy() {
  const router = useRouter();
  const { loading, progress, generateDummyReports } = useDummyLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <DummyHeader onBack={() => router.back()} />

      <ScrollView className="flex-1 p-6">
        <View className="mb-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-4">
          <View className="mb-2 flex-row items-center">
            <Ionicons name="warning-outline" size={20} color="#D97706" />
            <Text className="ml-2 font-bold text-yellow-800">Perhatian</Text>
          </View>
          <Text className="text-xs leading-5 text-yellow-700">
            Fitur ini digunakan untuk membuat data dummy guna keperluan
            pengujian statistik. Data yang dibuat akan muncul di daftar laporan
            masyarakat.
          </Text>
        </View>

        {loading && progress.total > 0 && (
          <View className="mb-6 items-center justify-center rounded-2xl bg-blue-600 p-6 shadow-lg shadow-blue-200">
            <Text className="mb-2 font-bold text-white">
              Sedang Memproses...
            </Text>
            <Text className="text-3xl font-black text-white">
              {progress.current} / {progress.total}
            </Text>
            <View className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-400/30">
              <View
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
                className="h-full bg-white"
              />
            </View>
          </View>
        )}

        <GenerateCard
          count={5}
          loading={loading}
          onPress={() => generateDummyReports(5)}
        />
        <GenerateCard
          count={10}
          loading={loading}
          onPress={() => generateDummyReports(10)}
        />
        <GenerateCard
          count={25}
          loading={loading}
          onPress={() => generateDummyReports(25)}
        />

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
