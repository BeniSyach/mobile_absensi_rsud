/* eslint-disable max-lines-per-function */
import 'dayjs/locale/id';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import {
  PostKegiatanHarian,
  type PostKegiatanHarianVariables,
  queryClient,
} from '@/api';
import FormTambahKegiatan, {
  type FormKegiatanProps,
} from '@/components/ekin-component/tambah-kegiatan-component/form-tambah-kegiatan';
import LogoTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/logo-tambah-kegiatan';
import NavbarTambahKegiatan from '@/components/ekin-component/tambah-kegiatan-component/navbar-tambah-kegiatan';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib';
dayjs.extend(customParseFormat);
dayjs.locale('id');

export default function TambahKegiatan() {
  const storedMessage = getMessage();
  const { mutateAsync: postKegiatan, isPending: isPosting } =
    PostKegiatanHarian({
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

  const onSubmit: FormKegiatanProps['onSubmit'] = async (data) => {
    const tgl_kinerja = dayjs(
      `${data.tanggal} ${data.waktu_tanggal}`,
      'DD MMMM YYYY HH:mm'
    ).format('YYYY-MM-DDTHH:mm:ss');

    const payload: PostKegiatanHarianVariables = {
      waktu_kinerja: data.lamaWaktu,
      tgl_kinerja: tgl_kinerja,
      id_rhkstaff: data.selectedrhk,
      indikator: data.selectedIndikator ?? '',
      id_satuan: data.satuan,
      uraian_tugas: data.uraian_tugas,
      nik: storedMessage?.nik ?? '',
      nilai: Number(data.jumlah_capaian),
      status: 0,
    };

    await postKegiatan(payload);
    queryClient.invalidateQueries({ queryKey: ['getKegiatanHarianByUser'] });
    queryClient.invalidateQueries({ queryKey: ['getDashboardPegawaiBawahan'] });
    queryClient.invalidateQueries({ queryKey: ['getDashboardPegawai'] });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Home ekin',
          headerBackTitle: 'Home ekin',
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <ImageBackground
          source={require('../../../../assets/background/dashboard_ekin.png')}
          resizeMode="cover"
          className="flex-1"
        >
          <ImageBackground
            source={require('../../../../assets/image/header_background_ekin.png')}
            resizeMode="cover"
            className="h-[19%] w-full"
          >
            <NavbarTambahKegiatan />
            <LogoTambahKegiatan />
          </ImageBackground>

          <FormTambahKegiatan
            onSubmit={onSubmit}
            dataUserLogin={storedMessage}
            isPending={isPosting}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
