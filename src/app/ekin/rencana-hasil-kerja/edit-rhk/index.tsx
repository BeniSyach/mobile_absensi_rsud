import { Stack, useLocalSearchParams } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import { UseProfileEkin } from '@/api';
import FormEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/form-edit-rhk';
import LogoEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/logo-edit-rhk';
import NavbarEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/navbar-add-rhk';

export default function EditRHK() {
  const { data: dataProfile } = UseProfileEkin();

  const rawParams = useLocalSearchParams();

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
        <FormEditRHK dataAtasan={dataProfile?.atasan.nik} dataEdit={item} />
      </ImageBackground>
    </SafeAreaView>
  );
}
