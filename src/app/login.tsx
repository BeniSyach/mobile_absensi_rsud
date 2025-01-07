import { useRouter } from 'expo-router';
import React from 'react';

import { useLogin } from '@/api/auth/login';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';
import { setMessage } from '@/lib/message-storage';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  const { mutate, isPending, isError } = useLogin({
    onSuccess: (data) => {
      const access = data.token;
      const refresh = data.token;
      const successMessage = data.message;

      console.log('Login successful:', { access, refresh });

      // Simpan token ke auth state
      signIn({ access, refresh });
      setMessage(successMessage);

      // Arahkan ke halaman utama
      router.push('/');
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data || error.message);
    },
  });

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);
    mutate(data);
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isPending={isPending} isError={isError} />
    </>
  );
}
