/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFaceRecognition } from '@/api';
import { useGetDashboardCuti } from '@/api/cuti/use-get-dashboard-cuti';
import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import { CutiProfile } from '@/components/cuti-component/cuti-profile';
import { DashboardCuti } from '@/components/cuti-component/dashboard-cuti';
import { Image, Text } from '@/components/ui';
import { getMessage } from '@/lib';

const storage = new MMKV({
  id: 'face-auth',
});

const FACE_URI_KEY = 'face_photo_uri';
const FACE_EMBED_KEY = 'face_embedding';

export default function Cuti() {
  const storedMessage = getMessage();
  const nik = storedMessage?.nik ?? '';
  // ambil dari MMKV
  const cachedUri = storage.getString(FACE_URI_KEY);
  const cachedEmbedding = storage.getString(FACE_EMBED_KEY);
  const { data: dataCuti } = useGetDashboardCuti({
    variables: { nik },
    enabled: false, // ⬅️ kita trigger manual
  });

  const {
    data: wajah,
    isLoading: loadingWajah,
    isError: errorWajah,
  } = useFaceRecognition({ variables: { nik } });

  useEffect(() => {
    if (cachedUri && cachedEmbedding) {
      return;
    }

    if (!wajah) return;

    if (wajah.status === 0) {
      Alert.alert('Peringatan', wajah.message, [
        {
          text: 'Pindah Ke menu Profile',
          onPress: () => router.replace('/settings'),
        },
      ]);
    } else {
      if (wajah.photo_path) {
        const url = `${Env.API_URL}/absensi/files/faceprint/${wajah.photo_path}/view`;
        storage.set(FACE_URI_KEY, url);
      }
      if (wajah.embedding) {
        storage.set(
          FACE_EMBED_KEY,
          JSON.stringify(Array.from(wajah.embedding))
        );
      }
    }
  }, [wajah, cachedUri, cachedEmbedding]);

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Home Cuti',
          headerBackTitle: 'Home Cuti',
          headerShown: false,
        }}
      />
      <CutiNavbar title="Menu Utama" />
      <CutiProfile
        nama={storedMessage?.nama ?? ''}
        isLoading={loadingWajah}
        isError={errorWajah}
        photo={wajah}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
        <DashboardCuti data={dataCuti} />
        {/* <SectionHeader /> */}
        {/* <ListRiwayatCuti /> */}
        {/* 🔹 Area tombol di bawah */}
        {/* 🔹 Area tombol bawah */}
        <View className="px-4 pb-4">
          {/* Baris atas: 2 tombol */}
          <View className="mb-4 flex-row flex-wrap justify-center gap-6">
            {/* Tombol 1 */}
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-2xl bg-[#20A0D8] px-4 py-3 shadow"
              onPress={() => router.push('/cuti/status-cuti')}
            >
              <Image
                source={require('../../../assets/gif/status_cuti.gif')}
                className="size-12 rounded-lg"
                contentFit="contain"
              />
              <Text className="text-lg font-extrabold text-white">
                Status Cuti
              </Text>
            </TouchableOpacity>

            {/* Tombol 2 */}
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-2xl bg-[#20A0D8] px-4 py-3 shadow"
              onPress={() => router.push('/cuti/riwayat-cuti')}
            >
              <Image
                source={require('../../../assets/gif/riwayat_cuti.gif')}
                className="size-12 rounded-lg"
                contentFit="contain"
              />
              <Text className="text-lg font-extrabold text-white">
                Riwayat Cuti
              </Text>
            </TouchableOpacity>
          </View>

          {/* Baris bawah: 1 tombol di tengah */}
          <View className="flex-row justify-center">
            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-2xl bg-[#20A0D8] py-3 shadow"
              onPress={() => router.push('/cuti/ajukan-cuti')}
            >
              <Text className="text-lg font-extrabold text-white">
                Ajukan Cuti Anda
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
