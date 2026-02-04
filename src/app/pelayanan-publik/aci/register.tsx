import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { RegisterForm } from '@/components/pelayanan-publik-component/aci/register-form';
import { Checkbox } from '@/components/ui';

import { useRegisterLogic } from './use-register-logic';

const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return keyboardHeight;
};

const RegisterHeader = () => (
  <View className="mb-6 items-center">
    <View className="mb-2 items-center">
      <View className="h-1.5 w-16 rounded-full bg-gray-400" />
    </View>
    <Text className="mt-4 text-center text-2xl font-extrabold text-[#0B2347]">
      Buat Akun Baru
    </Text>
    <Text className="mt-1 text-center text-sm text-slate-600">
      Mohon isi data dengan lengkap dan benar
    </Text>
  </View>
);

const RegisterActions = ({
  agree,
  setAgree,
  onRegister,
}: {
  agree: boolean;
  setAgree: (val: boolean) => void;
  onRegister: () => void;
}) => {
  const router = useRouter();

  return (
    <>
      <View className="mt-4 flex-row items-start gap-2 px-1">
        <Checkbox
          checked={agree}
          onChange={setAgree}
          accessibilityLabel="Setuju S&K"
        />
        <Text className="flex-1 text-sm text-slate-600">
          Dengan mendaftar, Anda menyetujui{' '}
          <Text className="text-[#0066FF]">S&K</Text> serta{' '}
          <Text className="text-[#0066FF]">Kebijakan Privasi</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={onRegister}
        className="mt-2 items-center justify-center rounded-xl bg-[#0061e6] py-4"
        activeOpacity={0.8}
      >
        <Text className="text-center text-lg font-bold text-white">Daftar</Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center gap-1">
        <Text className="text-sm text-gray-600">Sudah punya akun?</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-sm font-bold text-[#0066FF] underline">
            Masuk
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const RegisterCard = ({
  keyboardHeight,
  agree,
  setAgree,
  handleRegister,
  formProps,
}: {
  keyboardHeight: number;
  agree: boolean;
  setAgree: (val: boolean) => void;
  handleRegister: () => void;
  formProps: React.ComponentProps<typeof RegisterForm>;
}) => (
  <View
    className="absolute w-full"
    style={{
      height: keyboardHeight > 0 ? undefined : '85%',
      top: keyboardHeight > 0 ? 0 : undefined,
      bottom: keyboardHeight,
    }}
  >
    <View className="size-full rounded-t-[30px] bg-white p-6 shadow-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <RegisterHeader />
        <RegisterForm {...formProps} />
        <RegisterActions
          agree={agree}
          setAgree={setAgree}
          onRegister={handleRegister}
        />
      </ScrollView>
    </View>
  </View>
);

export default function AciRegister() {
  const keyboardHeight = useKeyboardHeight();
  const {
    agree,
    setAgree,
    handleRegister,
    alertConfig,
    isPhoneVerified,
    ...formProps
  } = useRegisterLogic();

  return (
    <View className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require('../../../../assets/image/pelayanan-publik/aci/bg-aci.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <RegisterCard
          keyboardHeight={keyboardHeight}
          agree={agree}
          setAgree={setAgree}
          handleRegister={handleRegister}
          formProps={{ ...formProps, isPhoneVerified }}
        />
      </ImageBackground>
      <AciAlert {...alertConfig} />
    </View>
  );
}
