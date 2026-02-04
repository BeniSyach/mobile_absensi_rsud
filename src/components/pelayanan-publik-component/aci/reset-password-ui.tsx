import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

export const ResetPasswordHeader = () => (
  <View className="mb-6 items-center">
    <View className="mb-2 items-center">
      <View className="h-1.5 w-16 rounded-full bg-gray-400" />
    </View>
    <Text className="mt-4 text-center text-2xl font-extrabold text-[#0B2347]">
      Buat Kata Sandi Baru
    </Text>
    <Text className="mt-1 text-center text-sm text-slate-600">
      Kata sandi baru Anda harus berbeda dari kata sandi yang digunakan
      sebelumnya.
    </Text>
  </View>
);

export const SuccessAlertContent = ({
  onConfirm,
}: {
  onConfirm: () => void;
}) => (
  <View className="w-full items-center pt-4">
    <Text className="mb-4 text-center text-2xl font-extrabold text-[#0B2347]">
      Berhasil!
    </Text>

    <Text className="mb-8 text-center text-[13px] leading-5 text-gray-500">
      Kata sandi Anda telah berhasil diubah. Silakan masuk menggunakan kata
      sandi baru Anda.
    </Text>

    <TouchableOpacity
      onPress={onConfirm}
      className="w-full items-center justify-center rounded-full bg-[#0061e6] py-3.5"
    >
      <Text className="text-[15px] font-bold text-white">Masuk Sekarang</Text>
    </TouchableOpacity>
  </View>
);

interface ResetPasswordSuccessAlertProps {
  show: boolean;
  onConfirm: () => void;
}

export const ResetPasswordSuccessAlert = ({
  show,
  onConfirm,
}: ResetPasswordSuccessAlertProps) => (
  <AwesomeAlert
    show={show}
    showProgress={false}
    closeOnTouchOutside={false}
    closeOnHardwareBackPress={false}
    showCancelButton={false}
    showConfirmButton={false}
    contentContainerStyle={{
      borderRadius: 24,
      padding: 24,
      width: '85%',
    }}
    overlayStyle={{ width: '100%', height: '100%' }}
    customView={<SuccessAlertContent onConfirm={onConfirm} />}
  />
);
