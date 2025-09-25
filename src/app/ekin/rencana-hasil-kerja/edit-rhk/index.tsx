/* eslint-disable max-lines-per-function */
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import {
  PutRHKStaff,
  type PutRhkStaffVariables,
  queryClient,
  UseProfileEkin,
} from '@/api';
import FormEditRHK, {
  type FormEditRHKProps,
} from '@/components/ekin-component/rencana-hasil-kerja-component/edit/form-edit-rhk';
import LogoEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/logo-edit-rhk';
import NavbarEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/navbar-add-rhk';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib';

export default function EditRHK() {
  const { data: dataProfile } = UseProfileEkin();
  const rawParams = useLocalSearchParams();
  const storedMessage = getMessage();
  const { mutateAsync: putRHK, isPending: isPosting } = PutRHKStaff({
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
  const item = {
    uraian: typeof rawParams.uraian === 'string' ? rawParams.uraian : '',
    indikator:
      typeof rawParams.indikator === 'string' ? rawParams.indikator : '',
    nilai:
      typeof rawParams.nilai === 'string' && !isNaN(Number(rawParams.nilai))
        ? Number(rawParams.nilai)
        : 0,
    id:
      typeof rawParams.id === 'string' && !isNaN(Number(rawParams.id))
        ? Number(rawParams.id)
        : 0,
    id_rhk_pejabat:
      typeof rawParams.id_rhk_pejabat === 'string' &&
      !isNaN(Number(rawParams.id_rhk_pejabat))
        ? Number(rawParams.id_rhk_pejabat)
        : 0,
  };

  const onSubmit: FormEditRHKProps['onSubmit'] = async (data) => {
    const payload: PutRhkStaffVariables = {
      id: Number(item.id),
      id_rhk_pejabat: Number(data.id_rhk_pejabat),
      kode_unit_kerja: storedMessage?.kode_unit_kerja ?? '',
      indikator: data.indikator,
      uraian: data.uraian,
      nilai: Number(data.nilai),
      tahun: Number(data.tahun),
      id_satuan: Number(data.id_satuan),
    };

    await putRHK(payload);
    queryClient.invalidateQueries({ queryKey: ['getRhkStaffChild'] });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Edit RHK',
          headerBackTitle: 'Edit-RHK',
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
            <NavbarEditRHK />
            <LogoEditRHK />
          </ImageBackground>
          <FormEditRHK
            dataAtasan={dataProfile?.atasan.nik}
            dataEdit={item}
            onSubmit={onSubmit}
            isPending={isPosting}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
