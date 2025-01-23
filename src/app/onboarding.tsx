import { useRouter } from 'expo-router';
import React from 'react';

import { Cover } from '@/components/cover';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end ">
        <Text className="my-3 text-center text-5xl font-bold">
          Absensi RSUD Drs.H. Amri Tambunan
        </Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          "Kemudahan Dalam Genggaman Anda"
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">
          🚀 Efisiensi Kinerja
        </Text>
        <Text className="my-1 text-left text-lg">
          🥷 Developer experience + Productivity
        </Text>
        <Text className="my-1 text-left text-lg">
          🧩 Integrasi mudah dan cepat
        </Text>
        <Text className="my-1 text-left text-lg">💪 Absensi Lebih Akurat</Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Selanjutnya"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
