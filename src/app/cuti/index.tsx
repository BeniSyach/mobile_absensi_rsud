import { Env } from '@env';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Alert, ScrollView, StatusBar } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFaceRecognition } from '@/api';
import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import { CutiProfile } from '@/components/cuti-component/cuti-profile';
import { DashboardCuti } from '@/components/cuti-component/dashboard-cuti';
import { ListRiwayatCuti } from '@/components/cuti-component/list-riwayat-cuti';
import { SectionHeader } from '@/components/cuti-component/section-header';
import { getMessage } from '@/lib';

const storage = new MMKV({
  id: 'face-auth',
});

const FACE_URI_KEY = 'face_photo_uri';
const FACE_EMBED_KEY = 'face_embedding';

export default function Cuti() {
  const storedMessage = getMessage();
  // ambil dari MMKV
  const cachedUri = storage.getString(FACE_URI_KEY);
  const cachedEmbedding = storage.getString(FACE_EMBED_KEY);

  const {
    data: wajah,
    isLoading: loadingWajah,
    isError: errorWajah,
  } = useFaceRecognition({ variables: { nik: storedMessage?.nik ?? '' } });

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
      <CutiNavbar />
      <CutiProfile
        nama={storedMessage?.nama ?? ''}
        isLoading={loadingWajah}
        isError={errorWajah}
        photo={wajah}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
        <DashboardCuti />
        <SectionHeader />
        <ListRiwayatCuti />
      </ScrollView>
    </SafeAreaView>
  );
}
