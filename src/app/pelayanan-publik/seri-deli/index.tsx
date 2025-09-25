import { Stack } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, SafeAreaView, StatusBar, View } from 'react-native';

import { type Permohonan } from '@/api/perizinan';
import DataHasilSeriDeli from '@/components/pelayanan-publik-component/seri-deli-component/data-hasil-seri-deli';
import FromInputSeriDeli from '@/components/pelayanan-publik-component/seri-deli-component/form-input-seri-deli';
import { Image, Text } from '@/components/ui';

export default function MenuSeriDeli() {
  const [data, setData] = useState<Permohonan>();

  const handleDataFromChild = (data: Permohonan) => {
    setData(data);
  };
  return (
    <SafeAreaView className="flex-1 bg-[#2563EB]">
      <StatusBar backgroundColor="#2563EB" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Seri Deli',
          headerBackTitle: 'Seri Deli',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/image/pelayanan-publik/perizinan/background-seri-deli.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="p-4">
          {/* Header Section */}
          <View className="mb-6 items-center">
            <Text className="text-center text-xl italic text-gray-700">
              Selamat Datang di,
            </Text>

            <Image
              source={require('../../../../assets/image/pelayanan-publik/perizinan/icon-text-seri-deli.png')}
              contentFit="contain"
              style={{ width: 200, height: 30 }}
            />

            <Text className="mt-1 text-center text-xl font-extrabold text-gray-900">
              Sistem Elektronik Perizinan Deli Serdang
            </Text>
          </View>

          <FromInputSeriDeli dataDiterima={handleDataFromChild} />
        </View>
        {data && <DataHasilSeriDeli dataResponse={data} />}
      </ImageBackground>
    </SafeAreaView>
  );
}
