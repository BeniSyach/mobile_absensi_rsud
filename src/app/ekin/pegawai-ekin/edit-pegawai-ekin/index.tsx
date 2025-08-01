import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import EditDataPegawaiEkin, {
  type DataProfileEdit,
} from '@/components/ekin-component/data-pegawai-component/edit-data-pegawai-ekin';
import LogoDataPegawai from '@/components/ekin-component/data-pegawai-component/logo-data-pegawai';
import NavbarTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/navbar-tambah-kegiatan';
import { SafeAreaView } from '@/components/ui';

export default function EditPegawaiEkin() {
  const params = useLocalSearchParams();
  const dataProfileEdit: DataProfileEdit = useMemo(
    () => ({
      atasan: String(params.atasan ?? ''),
      golongan: String(params.golongan ?? ''),
      id: String(params.id ?? ''),
      jabatan: String(params.jabatan ?? ''),
      kode_opd: String(params.kode_opd ?? ''),
      nama: String(params.nama ?? ''),
      nik: String(params.nik ?? ''),
      nip: String(params.nip ?? ''),
      pangkat: String(params.pangkat ?? ''),
    }),
    [params]
  );
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Profile Pegawai ekin',
          headerBackTitle: 'Profile Pegawai ekin',
          headerShown: false,
        }}
      />

      <ImageBackground
        source={require('../../../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../../../assets/image/header_background_ekin.png')}
          resizeMode="cover"
          className="h-[19%] w-full"
        >
          <NavbarTambahKegiatan />
          <LogoDataPegawai />
        </ImageBackground>
        <EditDataPegawaiEkin dataProfileEdit={dataProfileEdit} />
      </ImageBackground>
    </SafeAreaView>
  );
}
