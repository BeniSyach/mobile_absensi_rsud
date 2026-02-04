import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';

import { type ResponPbbApi, type RiwayatNop } from '@/api/bapenda';
import CardEPbbSehat from '@/components/pelayanan-publik-component/epbb-sehat-component/card-epbb-sehat';
import { EmptyListPbb, Image, SafeAreaView, Text } from '@/components/ui';

const DataNopNewComponent = ({ data }: { data?: ResponPbbApi }) => {
  if (!data) return null;

  const wp = data.wajib_pajak;

  return (
    <View className="m-3 rounded-2xl bg-[#4B79EE66] p-6 shadow-lg shadow-gray-300">
      <Text className="text-primary mb-5 text-center text-lg font-bold">
        Informasi Objek Pajak
      </Text>

      {[
        ['NOP', data.nop],
        ['Nama', wp.nama],
        ['Alamat', wp.alamat],
        ['Kelurahan', wp.kelurahan],
        ['Kecamatan', wp.kecamatan],
        ['L. Tanah', `${wp.luas_tanah_m2} m²`],
        ['L. Bangunan', `${wp.luas_bangun_m2} m²`],
      ].map(([label, value], idx) => (
        <View key={idx} className="flex-row items-start">
          <Text className="w-32 text-sm font-medium text-gray-700">
            {label}
          </Text>
          <Text className="mr-1 text-sm text-gray-600">:</Text>
          <Text className="flex-1 text-sm font-semibold text-gray-900">
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default function DetailEpbbSehat() {
  const { data } = useLocalSearchParams<{ data?: string }>();

  const [pbb, setPbb] = useState<ResponPbbApi | null>(null);
  const [pending, setPending] = useState(true);

  React.useEffect(() => {
    if (data) {
      try {
        setPbb(JSON.parse(data));
      } catch (e) {
        console.error('JSON parse error', e);
      } finally {
        setPending(false);
      }
    } else {
      setPending(false);
    }
  }, [data]);

  const renderItem = React.useCallback(
    ({ item }: { item: RiwayatNop }) => (
      <CardEPbbSehat dataTagihan={item} nop={pbb?.nop ?? 'null'} />
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-[#2B1DAC]">
      <StatusBar backgroundColor="#2B1DAC" barStyle="light-content" />

      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require('../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <Image
          source={require('../../../../assets/image/pelayanan-publik/logo_kab.png')}
          contentFit="contain"
          className="my-4 size-28 self-center"
        />

        <DataNopNewComponent data={pbb ?? undefined} />

        {pbb && <Text className="m-3 text-xl font-bold">Riwayat Pajak</Text>}

        <FlashList
          data={pbb?.riwayat_nop ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item.tahun_pajak}
          ListEmptyComponent={<EmptyListPbb isLoading={pending} />}
          estimatedItemSize={120}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
