import { Stack, useLocalSearchParams } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import FormAddRHK from '@/components/ekin-component/rencana-hasil-kerja-component/post/form-add-rhk';
import LogoAddRHK from '@/components/ekin-component/rencana-hasil-kerja-component/post/logo-add-rhk';
import NavbarAddRHK from '@/components/ekin-component/rencana-hasil-kerja-component/post/navbar-add-rhk';

export default function PostRHK() {
  const { atasan } = useLocalSearchParams();
  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Tambah RHK',
          headerBackTitle: 'Tambah-RHK',
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
          <NavbarAddRHK />
          <LogoAddRHK />
        </ImageBackground>
        <FormAddRHK dataAtasan={atasan as string} />
      </ImageBackground>
    </SafeAreaView>
  );
}
