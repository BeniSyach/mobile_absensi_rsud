/* eslint-disable max-lines-per-function */
import { Stack, useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { ImageBackground, ScrollView, StatusBar } from 'react-native';

import {
  useFaceRecognition,
  useGetAllAbsenMasukByUser,
  useRekapitulasiAbsenUser,
} from '@/api';
import CardRekapAbsensi from '@/components/absensi/menu-utama/card-rekap-absensi';
import CardWaktuAbsensi from '@/components/absensi/menu-utama/card-waktu-absensi';
import DaftarAbsensiCard from '@/components/absensi/menu-utama/daftar-card-absensi';
import MenuAbsensiComponent from '@/components/absensi/menu-utama/menu-absensi-component';
import ProfileCardAbsensi from '@/components/absensi/menu-utama/profile-card-absensi';
import { Button, SafeAreaView } from '@/components/ui';
import { getMessage } from '@/lib';

export default function MenuAbsensi() {
  const storedMessage = getMessage();
  const router = useRouter();
  const userId = storedMessage?.nik ?? '';
  const page = 1;
  const {
    data: fetchedData,
    isPending,
    isError,
  } = useGetAllAbsenMasukByUser({
    variables: { userId, page },
    enabled: !!userId,
  });
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
  return (
    <SafeAreaView className="flex-1">
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
            jamMasuk={fetchedData?.data[0]?.waktu_masuk ?? undefined}
            jamKeluar={
              fetchedData?.data[0]?.absen_pulang[0]?.waktu_pulang ?? undefined
            }
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
            data={fetchedData?.data ?? []}
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
