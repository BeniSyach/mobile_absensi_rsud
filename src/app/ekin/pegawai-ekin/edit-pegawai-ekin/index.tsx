/* eslint-disable max-lines-per-function */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import {
  PutPegawai,
  type PutPegawaiVariables,
  queryClient,
  UpdateAtasanUser,
  type UpdateAtasanVariables,
} from '@/api';
import EditDataPegawaiEkin, {
  type DataProfileEdit,
  type EditDataPegawaiProps,
} from '@/components/ekin-component/data-pegawai-component/edit-data-pegawai-ekin';
import LogoDataPegawai from '@/components/ekin-component/data-pegawai-component/logo-data-pegawai';
import NavbarTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/navbar-tambah-kegiatan';
import { showErrorMessage } from '@/components/ui';

export default function EditPegawaiEkin() {
  const params = useLocalSearchParams();

  const { mutateAsync: updateAtasan, isPending: isPosting } = UpdateAtasanUser({
    onSuccess: (res) => {
      showMessage({
        message: res.message,
        type: 'success',
        duration: 7000,
      });
    },
    onError: (e) => {
      showErrorMessage(e.message);
    },
  });

  const { mutateAsync: updatePegawai, isPending: isPostingPegawai } =
    PutPegawai({
      onSuccess: (res) => {
        showMessage({
          message: res.message,
          type: 'success',
          duration: 7000,
        });
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
    }),
    [params]
  );

  const onSubmit: EditDataPegawaiProps['onSubmit'] = async (data) => {
    const payload: UpdateAtasanVariables = {
      nik_user: dataProfileEdit?.nik ?? '',
      nik_atasan: data.atasan ?? '0',
    };

    const payloadPegawai: PutPegawaiVariables = {
      nama: dataProfileEdit?.nama ?? '',
      nip: dataProfileEdit?.nip ?? '',
      pangkat_id: data.pangkat_id ?? '',
      golongan_ruang_id: data.golongan_ruang_id ?? '',
      jabatan_id: data.jabatan_id ?? '',
      eselon_id: data.eselon_id ?? '',
      nik: dataProfileEdit?.nik ?? '',
    };

    await updateAtasan(payload);
    await updatePegawai(payloadPegawai);
    queryClient.invalidateQueries({ queryKey: ['UseProfileEkin'] });
  };

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
            isPending={isPostingPegawai && isPosting}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
