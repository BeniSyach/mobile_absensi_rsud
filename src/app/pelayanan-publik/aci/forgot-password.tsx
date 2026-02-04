import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciInput } from '@/components/pelayanan-publik-component/aci/input-aci';

import { useForgotPasswordLogic } from './use-forgot-password-logic';

const ForgotPasswordHeader = () => (
  <View className="mb-6 items-center">
    <View className="mb-2 items-center">
      <View className="h-1.5 w-16 rounded-full bg-gray-400" />
    </View>
    <Text className="mt-4 text-center text-2xl font-extrabold text-[#0B2347]">
      Lupa Kata Sandi
    </Text>
    <Text className="mt-1 text-center text-sm text-slate-600">
      Masukkan nomor ponsel yang terdaftar untuk mengatur ulang kata sandi Anda.
    </Text>
  </View>
);

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="absolute left-4 top-12 z-10 size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
  >
    <Ionicons name="chevron-back" size={24} color="white" />
  </TouchableOpacity>
);

interface ForgotPasswordFormProps {
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
  onResetPassword: () => void;
  onLoginPress: () => void;
  error?: string;
  isLoading?: boolean;
}

const ForgotPasswordForm = ({
  phoneNumber,
  setPhoneNumber,
  onResetPassword,
  onLoginPress,
  error,
  isLoading,
}: ForgotPasswordFormProps) => (
  <View className="size-full rounded-t-[30px] bg-white p-6 shadow-lg">
    <ScrollView showsVerticalScrollIndicator={false}>
      <ForgotPasswordHeader />

      <View className="mb-6">
        <Text className="mb-2 ml-1 text-sm font-medium text-gray-700">
          Nomor Ponsel
        </Text>
        <AciInput
          leftIcon={
            <Ionicons name="phone-portrait-outline" size={20} color="#9ca3af" />
          }
          placeholder="Masukan nomor ponsel"
          keyboardType="phone-pad"
          className="rounded-full border border-gray-300 bg-white py-3 pr-4"
          style={{ paddingLeft: 48 }}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          error={error}
        />
      </View>

      <TouchableOpacity
        onPress={onResetPassword}
        disabled={isLoading}
        className={`mb-4 items-center justify-center rounded-xl py-4 ${
          isLoading ? 'bg-gray-400' : 'bg-[#0061e6]'
        }`}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-lg font-bold text-white">
            Kirim
          </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center gap-1">
        <Text className="text-sm text-gray-600">Sudah ingat kata sandi?</Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text className="text-sm font-bold text-[#0066FF] underline">
            Masuk
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

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

export default function AciForgotPassword() {
  const keyboardHeight = useKeyboardHeight();
  const {
    phoneNumber,
    handlePhoneNumberChange,
    handleResetPassword,
    isLoading,
    error,
    router,
  } = useForgotPasswordLogic();

  return (
    <View className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require('../../../../assets/image/pelayanan-publik/aci/bg-aci.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <BackButton onPress={() => router.back()} />
        <View
          className="absolute w-full"
          style={{
            height: keyboardHeight > 0 ? undefined : '50%',
            top: keyboardHeight > 0 ? 100 : undefined,
            bottom: keyboardHeight,
          }}
        >
          <ForgotPasswordForm
            phoneNumber={phoneNumber}
            setPhoneNumber={handlePhoneNumberChange}
            onResetPassword={handleResetPassword}
            onLoginPress={() => router.back()}
            error={error}
            isLoading={isLoading}
          />
        </View>
      </ImageBackground>
    </View>
  );
}
