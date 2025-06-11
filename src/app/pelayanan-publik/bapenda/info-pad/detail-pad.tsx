import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import DataDetailPad from '@/components/pelayanan-publik-component/bapenda-component/info-pad-component/data-detail-pad';
import { SafeAreaView, Text, View } from '@/components/ui';

export default function DetailPad() {
  const { data } = useLocalSearchParams();
  const [pending, setPending] = useState(false);
  // Decode string data
  let parsedData: any = {};
  try {
    parsedData = data ? JSON.parse(data as string) : {};
  } catch (err) {
    console.error('Failed to parse data', err);
    setPending(false);
  }
  return (
    <SafeAreaView className="flex-1 bg-[#2B1DAC]">
      <StatusBar backgroundColor="#2B1DAC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Info Detail PAD',
          headerBackTitle: 'Info Detail PAD',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="p-2">
          <View className="rounded-lg bg-white p-2 shadow-md shadow-gray-400">
            <Text className="text-primary mb-2 text-center text-xl font-bold text-black">
              Detail Pajak
            </Text>
            {[
              ['NPWD', parsedData.NPWPD],
              ['Nama', parsedData.NAMA_WP],
              ['Alamat', parsedData.ALAMAT],
              ['Kelurahan', parsedData.KELURAHAN],
              ['Kecamatan', parsedData.KECAMATAN],
              ['Jenis', parsedData.JENIS],
              ['Golongan', parsedData.GOLONGAN],
              ['Tgl Daftar', parsedData.TGL_DAFTAR],
              ['No. Pengukuhan', parsedData.NO_PENGUKUHAN],
              ['Status', parsedData.STATUS],
            ].map(([label, value], index) => (
              <View key={index} className="mb-2 flex-row">
                <Text className="w-40 font-semibold text-gray-700">
                  {label}
                </Text>
                <Text className="mr-1 text-gray-600">:</Text>
                <Text className="flex-1 font-medium text-gray-900">
                  {value ?? '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-1">
          <DataDetailPad data={parsedData.TAGIHAN} Pending={pending} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
