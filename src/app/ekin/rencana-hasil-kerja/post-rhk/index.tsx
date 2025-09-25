import { Stack, useLocalSearchParams } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { PostRHKStaff, type PostRhkStaffVariables, queryClient } from '@/api';
import FormAddRHK, {
  type FormAddRHKProps,
} from '@/components/ekin-component/rencana-hasil-kerja-component/post/form-add-rhk';
import LogoAddRHK from '@/components/ekin-component/rencana-hasil-kerja-component/post/logo-add-rhk';
import NavbarAddRHK from '@/components/ekin-component/rencana-hasil-kerja-component/post/navbar-add-rhk';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib';

export default function PostRHK() {
  const { atasan } = useLocalSearchParams();
  const storedMessage = getMessage();
  const { mutateAsync: postRHK, isPending: isPosting } = PostRHKStaff({
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

  const onSubmit: FormAddRHKProps['onSubmit'] = async (data) => {
    const payload: PostRhkStaffVariables = {
      id_rhk_pejabat: Number(data.id_rhk_pejabat),
      nik: storedMessage?.nik ?? '',
      kode_unit_kerja: storedMessage?.kode_unit_kerja ?? '',
      indikator: data.indikator ?? '',
      uraian: data.uraian,
      nilai: Number(data.nilai),
      tahun: Number(data.tahun),
      id_satuan: Number(data.id_satuan),
    };

    await postRHK(payload);
    queryClient.invalidateQueries({ queryKey: ['getRhkStaffChild'] });
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
          <FormAddRHK
            dataAtasan={atasan as string}
            onSubmit={onSubmit}
            isPending={isPosting}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
