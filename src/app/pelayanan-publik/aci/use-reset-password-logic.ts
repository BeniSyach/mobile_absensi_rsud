import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { aciChangePassword } from './aci-service';

const validateResetForm = (password: string, confirmPassword: string) => {
  const newErrors: { password?: string; confirmPassword?: string } = {};
  let valid = true;

  if (!password) {
    newErrors.password = 'Wajib diisi.';
    valid = false;
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = 'Wajib diisi.';
    valid = false;
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Kata sandi tidak cocok.';
    valid = false;
  }

  return { valid, newErrors };
};

const executeResetAction = async ({
  phoneNumber,
  password,
  confirmPassword,
  otp,
  router,
  onSuccess,
  setIsLoading,
}: {
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  otp: string;
  router: any;
  onSuccess?: () => void;
  setIsLoading: (val: boolean) => void;
}) => {
  setIsLoading(true);
  try {
    const response = await aciChangePassword({
      login: phoneNumber,
      otp: otp,
      password: password,
      password_confirmation: confirmPassword,
    });
    if (response.status || response === true) {
      if (onSuccess) {
        onSuccess();
      } else {
        Alert.alert('Sukses', 'Kata sandi Anda berhasil diatur ulang.', [
          {
            text: 'OK',
            onPress: () => {
              router.dismissAll();
              router.replace('/pelayanan-publik/aci');
            },
          },
        ]);
      }
    } else {
      Alert.alert('Gagal', response.message || 'Gagal reset kata sandi.');
    }
  } catch (error: any) {
    Alert.alert(
      'Error',
      error.response?.data?.message || 'Terjadi kesalahan sistem.'
    );
  } finally {
    setIsLoading(false);
  }
};

export const useResetPasswordLogic = (options?: { onSuccess?: () => void }) => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber: string;
    otp: string;
  }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleResetPassword = () => {
    const { valid, newErrors } = validateResetForm(password, confirmPassword);
    setErrors(newErrors);
    if (valid) {
      if (!params.otp) {
        Alert.alert('Error', 'Kode OTP tidak ditemukan.');
        return;
      }
      executeResetAction({
        phoneNumber: params.phoneNumber,
        password,
        confirmPassword,
        otp: params.otp,
        router,
        onSuccess: options?.onSuccess,
        setIsLoading,
      });
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isPasswordVisible,
    setIsPasswordVisible,
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
    errors,
    handleResetPassword,
    isLoading,
  };
};

export default function Ignored() {
  return null;
}
