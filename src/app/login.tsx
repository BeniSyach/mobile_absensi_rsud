import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';

import { type LoginVariables, useLogin } from '@/api';
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

  console.log('Device Persistent ID:', deviceId);
  return deviceId;
};

interface ErrorResponse {
  error: string;
}

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getPersistentDeviceId();
      setDeviceId(id);
    };

    fetchDeviceId();
  }, []);

  const handleLoginSuccess = (data: any) => {
    const access = data.token;
    const refresh = data.token;
    const successMessage = data.message;

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
    showErrorMessage(
      (error.response?.data as ErrorResponse)?.error || error.message
    );
  };

  const { mutate, isPending, isError } = useLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    const loginData = {
      ...data,
      device_token: deviceId, // Add deviceId here
    };
    mutate(loginData);
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isPending={isPending} isError={isError} />
    </>
  );
}
