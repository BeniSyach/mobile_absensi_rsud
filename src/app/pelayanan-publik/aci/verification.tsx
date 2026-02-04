import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Text } from '@/components/ui/text';

import { useVerificationLogic } from './use-verification-logic';

const OtpInput = ({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.join('').length === length) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="my-8 flex-row justify-between px-2">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          className={`h-14 w-12 rounded-2xl border-2 bg-white text-center text-2xl font-bold ${
            digit || inputs.current[index]?.isFocused()
              ? 'border-[#0066FF] text-[#0B2347]'
              : 'border-[#0066FF] text-[#0B2347]'
          }`}
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            includeFontPadding: false,
          }}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const VerificationHeader = ({ phoneNumber }: { phoneNumber: string }) => (
  <View className="mb-6 items-center">
    <View className="mb-6 h-1.5 w-16 rounded-full bg-gray-400" />
    <Text className="text-center text-2xl font-extrabold text-[#0B2347]">
      Verifikasi Nomor Anda
    </Text>
    <Text className="mt-2 text-center text-base text-slate-600">
      Masukan 6 digit kode OTP yang telah kami kirim via WhatsApp ke nomor
    </Text>
    <Text className="mt-1 text-center text-base font-bold text-[#0B2347]">
      {phoneNumber || '+62 822-0000-0000'}
    </Text>
  </View>
);

const VerificationFooter = ({
  timeLeft,
  formatTime,
  setTimeLeft,
  handleVerify,
  handleResendOtp,
  loading,
}: {
  timeLeft: number;
  formatTime: (s: number) => string;
  setTimeLeft: (t: number) => void;
  handleVerify: () => void;
  handleResendOtp: () => Promise<boolean>;
  loading: boolean;
}) => (
  <>
    <View className="flex-row justify-between px-2">
      <Text className="text-sm text-gray-500">
        Kirim ulang dalam {formatTime(timeLeft)}
      </Text>
    </View>

    <View className="mt-2 flex-row flex-wrap justify-center gap-1 px-2">
      <Text className="text-sm text-gray-600">Belum terima kode OTP?</Text>
      <TouchableOpacity
        onPress={async () => {
          if (timeLeft === 0 && !loading) {
            const success = await handleResendOtp();
            if (success) setTimeLeft(75);
          }
        }}
        disabled={timeLeft > 0 || loading}
      >
        <Text
          className={`text-sm font-bold underline ${
            timeLeft > 0 || loading ? 'text-gray-400' : 'text-[#0066FF]'
          }`}
        >
          Kirim ulang kode OTP
        </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      onPress={handleVerify}
      disabled={loading}
      className={`mt-8 items-center justify-center rounded-xl py-4 ${
        loading ? 'bg-gray-400' : 'bg-[#0061e6]'
      }`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-center text-lg font-bold text-white">
          Verifikasi
        </Text>
      )}
    </TouchableOpacity>
  </>
);

const useOtpTimer = () => {
  const [timeLeft, setTimeLeft] = useState(75);

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return { timeLeft, setTimeLeft, formatTime };
};

export default function AciVerification() {
  const {
    setOtpInput,
    handleVerify,
    handleResendOtp,
    alertConfig,
    loading,
    phoneNumber,
  } = useVerificationLogic();

  const { timeLeft, setTimeLeft, formatTime } = useOtpTimer();

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
          <View className="h-[85%] w-full rounded-t-[30px] bg-white p-6 shadow-lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              <VerificationHeader phoneNumber={phoneNumber || ''} />
              <OtpInput onComplete={setOtpInput} />
              <VerificationFooter
                timeLeft={timeLeft}
                formatTime={formatTime}
                setTimeLeft={setTimeLeft}
                handleVerify={handleVerify}
                handleResendOtp={handleResendOtp}
                loading={loading}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
      <AciAlert
        show={alertConfig.show}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
      />
    </View>
  );
}
