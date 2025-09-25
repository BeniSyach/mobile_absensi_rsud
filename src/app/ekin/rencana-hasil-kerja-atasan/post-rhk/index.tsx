import { Stack } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import {
  type CreateRHKPejabatPayload,
  PostRHKPejabat,
  queryClient,
  UseProfileEkin,
} from '@/api';
import FormAddRHKAtasan, {
  type FormAddRHKPejabatProps,
} from '@/components/ekin-component/rencana-hasil-kerja-atasan-compoenet/post/form-add-rhk-atasan';
import LogoAddRHK from '@/components/ekin-component/rencana-hasil-kerja-component/post/logo-add-rhk';
import NavbarAddRHK from '@/components/ekin-component/rencana-hasil-kerja-component/post/navbar-add-rhk';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib';

export default function PostRHKAtasan() {
  const { data: dataProfil } = UseProfileEkin();
  const storedMessage = getMessage();
  const { mutateAsync: postRHK, isPending: isPosting } = PostRHKPejabat({
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
  const onSubmit: FormAddRHKPejabatProps['onSubmit'] = async (data) => {
    const payload: CreateRHKPejabatPayload = {
      nik: storedMessage?.nik ?? '',
      kode_unit_kerja: storedMessage?.kode_unit_kerja ?? '',
      indikator: data.indikator ?? '',
      uraian: data.uraian,
      nilai: Number(data.nilai),
      tahun: Number(data.tahun),
      id_satuan: Number(data.id_satuan),
      kode_pangkat: dataProfil?.detail_pegawai?.data?.pangkat_id ?? '',
      kode_jabatan: dataProfil?.detail_pegawai?.data?.jabatan_id ?? '',
    };

    await postRHK(payload);
    queryClient.invalidateQueries({ queryKey: ['useRHKPejabatByNIK'] });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Tambah RHK',
          headerBackTitle: 'Tambah-RHK',
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
            <NavbarAddRHK />
            <LogoAddRHK />
          </ImageBackground>
          <FormAddRHKAtasan onSubmit={onSubmit} isPending={isPosting} />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
