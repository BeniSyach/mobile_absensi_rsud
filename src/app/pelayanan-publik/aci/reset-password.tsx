// cspell:ignore publik
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

import { useResetPasswordLogic } from '@/app/pelayanan-publik/aci/use-reset-password-logic';
import { ResetPasswordForm } from '@/components/pelayanan-publik-component/aci/reset-password-form';
import {
  ResetPasswordHeader,
  ResetPasswordSuccessAlert,
} from '@/components/pelayanan-publik-component/aci/reset-password-ui';

export default function AciResetPassword() {
  const router = useRouter();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const {
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
  } = useResetPasswordLogic({
    onSuccess: () => setShowSuccessAlert(true),
  });

  const handleConfirmSuccess = () => {
    setShowSuccessAlert(false);
    router.dismissAll();
    router.replace('/pelayanan-publik/aci');
  };

  return (
    <View className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require('../../../../assets/image/pelayanan-publik/aci/bg-aci.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end"
        >
          <View className="h-3/4 w-full rounded-t-[30px] bg-white p-6 shadow-lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              <ResetPasswordHeader />

              <ResetPasswordForm
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                isPasswordVisible={isPasswordVisible}
                setIsPasswordVisible={setIsPasswordVisible}
                isConfirmPasswordVisible={isConfirmPasswordVisible}
                setIsConfirmPasswordVisible={setIsConfirmPasswordVisible}
                onSubmit={handleResetPassword}
                errors={errors}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>

      <ResetPasswordSuccessAlert
        show={showSuccessAlert}
        onConfirm={handleConfirmSuccess}
      />
    </View>
  );
}
