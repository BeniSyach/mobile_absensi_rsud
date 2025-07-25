import { Stack } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import FormEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/form-edit-rhk';
import LogoEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/logo-edit-rhk';
import NavbarEditRHK from '@/components/ekin-component/rencana-hasil-kerja-component/edit/navbar-add-rhk';

export default function EditRHK() {
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="light-content" />
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
        <FormEditRHK />
      </ImageBackground>
    </SafeAreaView>
  );
}
