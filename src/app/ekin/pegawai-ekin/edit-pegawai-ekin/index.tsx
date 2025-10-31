/* eslint-disable max-lines-per-function */
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PutPegawai, type PutPegawaiVariables, queryClient } from '@/api';
import EditDataPegawaiEkin, {
  type DataProfileEdit,
  type EditDataPegawaiProps,
} from '@/components/ekin-component/data-pegawai-component/edit-data-pegawai-ekin';
import LogoDataPegawai from '@/components/ekin-component/data-pegawai-component/logo-data-pegawai';
import NavbarTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/navbar-tambah-kegiatan';
import { showErrorMessage } from '@/components/ui';

export default function EditPegawaiEkin() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { mutateAsync: updatePegawai, isPending: isPostingPegawai } =
    PutPegawai({
      onSuccess: (res) => {
        showMessage({
          message: res.message,
          type: 'success',
          duration: 7000,
        });
        router.back();
      },
      onError: (e) => {
        showErrorMessage(e.message);
      },
    });

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
      kode_eselon: String(params.kode_eselon ?? ''),
    }),
    [params]
  );

  const onSubmit: EditDataPegawaiProps['onSubmit'] = async (data) => {
    const payloadPegawai: PutPegawaiVariables = {
      nama: dataProfileEdit?.nama ?? '',
      nip: dataProfileEdit?.nip ?? '',
      pangkat_id: data.pangkat_id ?? '',
      golongan_ruang_id: data.golongan_ruang_id ?? '',
      jabatan_id: data.jabatan_id ?? '',
      eselon_id: data.eselon_id ?? '',
      nik: dataProfileEdit?.nik ?? '',
      atasan_id: data.atasan,
    };

    await updatePegawai(payloadPegawai);
    queryClient.invalidateQueries({ queryKey: ['getUser'] });
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#287BDC]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Profile Pegawai ekin',
          headerBackTitle: 'Profile Pegawai ekin',
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
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
          <EditDataPegawaiEkin
            dataProfileEdit={dataProfileEdit}
            onSubmit={onSubmit}
            isPending={isPostingPegawai}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
