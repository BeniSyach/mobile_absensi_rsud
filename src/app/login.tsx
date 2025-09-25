import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { type LoginResponse, type LoginVariables, useLogin } from '@/api';
import Footer from '@/components/home/footer';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar, showErrorMessage } from '@/components/ui';
import { getItem, setItem, setMessage, useAuth } from '@/lib';

const getPersistentDeviceId = async () => {
  let deviceId = getItem<string>('deviceId');

  if (!deviceId) {
    deviceId = await DeviceInfo.getUniqueId();
    await setItem('deviceId', deviceId);
  }

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
    const access = data?.access_token || '0';
    const refresh = data?.refresh_token || '0';
    const successMessage = data?.user || '0';
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
  const { mutateAsync, isPending, isError } = useLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });
  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    const loginData = {
      ...data,
      device_token: deviceId,
    };
    try {
      const response = await mutateAsync(loginData);
      handleLoginSuccess(response);
    } catch (error) {
      handleLoginError(error as AxiosError, loginData, null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
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
