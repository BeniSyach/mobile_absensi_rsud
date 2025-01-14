import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';

import { type LoginVariables, useLogin } from '@/api/auth/login';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar, showErrorMessage } from '@/components/ui';
import { useAuth } from '@/lib';
import { setMessage } from '@/lib/message-storage';

interface ErrorResponse {
  error: string; // Adjust the type based on your API response structure
}

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  const handleLoginSuccess = (data: any) => {
    const access = data.token;
    const refresh = data.token;
    const successMessage = data.message;

    console.log('Login successful:', { access, refresh });

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
