import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { type LoginResponse, type LoginVariables, useLogin } from '@/api';
import Footer from '@/components/home/footer';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import {
  FocusAwareStatusBar,
  SafeAreaView,
  showErrorMessage,
} from '@/components/ui';
import { getItem, setItem, setMessage, useAuth } from '@/lib';

const getPersistentDeviceId = async () => {
  let deviceId = getItem<string>('deviceId');

  if (!deviceId) {
    deviceId = await DeviceInfo.getUniqueId();
    await setItem('deviceId', deviceId);
  }

  console.log('Device Persistent ID:', deviceId);
  return deviceId;
};

export default function Login() {
  const status = useAuth.use.status();
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'signIn') {
      router.push('/');
    }
    const fetchDeviceId = async () => {
      const id = await getPersistentDeviceId();
      setDeviceId(id);
    };

    fetchDeviceId();
  }, [router, status]);

  const handleLoginSuccess = (data: LoginResponse) => {
    const access = data?.data?.tokens?.access_token || '0';
    const refresh = data?.data?.tokens?.refresh_token || '0';
    const successMessage = data?.data?.data_pegawai || '0';

    // Save token to auth state
    signIn({ access, refresh });
    setMessage(successMessage);

    // Redirect to the main page
    router.push('/');
  };

  const handleLoginError = (
    error: AxiosError<unknown, any>,
    _variables: LoginVariables,
    _context: unknown
  ) => {
    showErrorMessage((error.response?.data as any)?.message || error.message);
  };

  const { mutate, isPending, isError } = useLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    const loginData = {
      ...data,
      device_token: deviceId,
    };
    mutate(loginData);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <ImageBackground
        source={require('../../assets/background/background_login.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <FocusAwareStatusBar />
        <LoginForm
          onSubmit={onSubmit}
          isPending={isPending}
          isError={isError}
        />
        <Footer />
      </ImageBackground>
    </SafeAreaView>
  );
}
