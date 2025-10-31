/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import { Stack, useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { useEffect } from 'react';
import { Alert, ImageBackground, ScrollView, StatusBar } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  type AbsenMasuk,
  useFaceRecognition,
  useInfiniteAbsenMasukByUser,
  useRekapitulasiAbsenUser,
} from '@/api';
import CardRekapAbsensi from '@/components/absensi/menu-utama/card-rekap-absensi';
import CardWaktuAbsensi from '@/components/absensi/menu-utama/card-waktu-absensi';
import DaftarAbsensiCard from '@/components/absensi/menu-utama/daftar-card-absensi';
import MenuAbsensiComponent from '@/components/absensi/menu-utama/menu-absensi-component';
import ProfileCardAbsensi from '@/components/absensi/menu-utama/profile-card-absensi';
import { Button } from '@/components/ui';
import { getMessage } from '@/lib';

const storage = new MMKV({
  id: 'face-auth',
});

const FACE_URI_KEY = 'face_photo_uri';
const FACE_EMBED_KEY = 'face_embedding';

export default function MenuAbsensi() {
  const storedMessage = getMessage();
  const router = useRouter();
  // ambil dari MMKV
  const cachedUri = storage.getString(FACE_URI_KEY);
  const cachedEmbedding = storage.getString(FACE_EMBED_KEY);

  const userId = storedMessage?.nik ?? '';

  const limit = 10;

  const {
    data: fetchedData,
    isPending,
    isError,
  } = useInfiniteAbsenMasukByUser({
    variables: { userId, limit },
    enabled: !!userId,
  });

  const absensi: AbsenMasuk[] =
    fetchedData?.pages.flatMap((page) => page.data).slice(0, 10) ?? [];

  const {
    data: rekapAbsen,
    isPending: isPendingRekap,
    isError: isErrorRekap,
  } = useRekapitulasiAbsenUser({
    variables: { nik: userId },
    enabled: !!userId,
  });

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
  }, [wajah, cachedUri, cachedEmbedding, router]);

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Home Absensi',
          headerBackTitle: 'Home Absensi',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          nestedScrollEnabled
        >
          <ProfileCardAbsensi
            instansi={storedMessage?.nama_unit_kerja ?? ''}
            nama={storedMessage?.nama ?? ''}
            gelarDepan=""
            gelarBelakang=""
            isLoading={loadingWajah}
            isError={errorWajah}
            photo={wajah}
          />
          <CardWaktuAbsensi
            jamMasuk={absensi[0]?.waktu_masuk}
            jamKeluar={absensi[0]?.absen_pulang?.[0]?.waktu_pulang}
          />
          <CardRekapAbsensi
            progress={rekapAbsen?.data.persentase_durasi}
            isPending={isPendingRekap}
            isError={isErrorRekap}
            totalMasuk={rekapAbsen?.data.total_absen_masuk}
            totalPulang={rekapAbsen?.data.total_absen_pulang}
            total_durasi_kerja={rekapAbsen?.data.total_durasi_kerja}
          />
          <MenuAbsensiComponent />
          <DaftarAbsensiCard
            data={absensi ?? []}
            isPending={isPending}
            isError={isError}
          />
          <Button
            label="Absensi"
            variant="outline"
            className="mx-28 rounded-full bg-[#20A0D8]"
            icon={<Clock size={20} color="white" />}
            size="lg"
            onPress={() =>
              router.push({
                pathname: '/absensi',
              })
            }
          />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
