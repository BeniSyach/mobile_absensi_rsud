/* eslint-disable max-lines-per-function */
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostOTP, PostVerifyOTP, PutPasswordUser, queryClient } from '@/api';
import FormEditPassword from '@/components/edit-password-user/form-edit-password';
import { showErrorMessage } from '@/components/ui';
import { useAuth } from '@/lib';

export default function ResetPassword() {
  const router = useRouter();
  const signOut = useAuth((state) => state.signOut);
  const [resetToken, setResetToken] = React.useState<string | null>(null);
  const { mutateAsync: kirimOTP, isPending: pendingOTP } = PostOTP({
    onSuccess: () => {
      showMessage({
        message: 'Berhasil Mengirim OTP',
        type: 'success',
        duration: 7000,
      });
    },
    onError: (e) => {
      showErrorMessage(e.message);
    },
  });

  const { mutateAsync: verifyOTP, isPending: pendingVerify } = PostVerifyOTP({
    onSuccess: (res) => {
      // simpan token dari API verify
      if (res?.reset_token) {
        setResetToken(res.reset_token);
      }
      showMessage({ message: 'OTP valid', type: 'success' });
    },
    onError: (e) => {
      showErrorMessage(e.message);
    },
  });
  const { mutateAsync: changePassword, isPending: pendingChangePassword } =
    PutPasswordUser({
      onSuccess: () => {
        showMessage({
          message: 'Password berhasil direset',
          type: 'success',
          duration: 7000,
        });

        // refresh query status password
        queryClient.invalidateQueries({ queryKey: ['useCheckPasswordUser'] });

        setTimeout(() => {
          signOut();
          router.replace('/onboarding');
        }, 2000);
      },
      onError: (e) => {
        showErrorMessage(e.message);
      },
    });

  const handleSubmitStepper = async (data: any) => {
    if ('no_wa' in data) {
      // Step 1
      await kirimOTP({ no_hp: data.no_wa });
    } else if ('otp' in data) {
      // Step 2
      await verifyOTP({ otp: data.otp });
    } else if ('password' in data) {
      // Step 3
      await changePassword({
        reset_token: resetToken ?? '',
        password: data.password,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Reset Password',
          headerBackTitle: 'reset-password',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/background/background_absensi.png')}
        resizeMode="cover"
        className="flex-1 px-4"
      >
        <FormEditPassword
          onSubmit={handleSubmitStepper}
          isPending={pendingOTP || pendingVerify || pendingChangePassword}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
