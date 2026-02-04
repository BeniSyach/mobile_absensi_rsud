import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { aciSendOtpReset, normalizeAciPhoneNumber } from './aci-service';

export const useForgotPasswordLogic = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (error) setError('');
  };

  const handleResetPassword = async () => {
    if (!phoneNumber) {
      setError('Nomor ponsel wajib diisi.');
      return;
    }

    if (phoneNumber.length < 10) {
      setError('Nomor ponsel minimal 10 digit.');
      return;
    }

    setIsLoading(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const normalizedPhone = normalizeAciPhoneNumber(phoneNumber);

    try {
      // Use new endpoint for OTP Reset
      const response = await aciSendOtpReset({
        no_wa: normalizedPhone,
        otp: generatedOtp,
      });

      if (response.status) {
        console.log('OTP Reset Sent Successfully');

        router.push({
          pathname: '/pelayanan-publik/aci/verification',
          params: {
            phoneNumber: normalizedPhone,
            otp: generatedOtp,
            source: 'forgot-password',
          },
        });
      } else {
        Alert.alert('Gagal', response.message || 'Gagal mengirim OTP');
      }
    } catch (err: any) {
      console.error('Forgot Password OTP Error:', err);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Terjadi kesalahan koneksi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phoneNumber,
    handlePhoneNumberChange,
    handleResetPassword,
    isLoading,
    error,
    router,
  };
};

export default function Ignored() {
  return null;
}
