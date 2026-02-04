import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import {
  aciRegister,
  aciSendOtp,
  aciSendOtpReset,
  normalizeAciPhoneNumber,
  normalizeTo62,
} from './aci-service';
import { useAciAlert } from './hooks/use-aci-alert';

const handleRegistrationAction = async (
  params: any,
  { showAlert, setLoading, router }: any
) => {
  setLoading(true);
  try {
    const cleanPhone = normalizeAciPhoneNumber(params.phoneNumber);
    const cleanNik = params.nik?.replace(/[^0-9]/g, '') || '';

    const emailValue = params.email?.trim() || `${cleanPhone}@aci.com`;

    const payload: any = {
      name: params.name || '',
      no_wa: cleanPhone,
      nik: cleanNik,
      password: params.password || '',
      email: emailValue,
    };

    console.log(
      'Sending Registration Payload:',
      JSON.stringify(payload, null, 2)
    );

    const response = await aciRegister(payload);

    if (response.status) {
      showAlert({
        type: 'success',
        title: 'Selamat\nVerifikasi Berhasil!',
        message:
          'Akun Anda telah aktif. Terima kasih telah bergabung dalam upaya peningkatan infrastruktur daerah. Silakan masuk untuk mulai melapor.',
        confirmText: 'Masuk Sekarang',
        onConfirm: () => {
          router.dismissAll();
          router.replace('/pelayanan-publik/aci');
        },
      });
    } else {
      showAlert({
        type: 'error',
        title: 'Gagal',
        message: response.message || 'Registrasi gagal.',
      });
    }
  } catch (error: any) {
    console.error(
      'Registration Error Full:',
      error.response?.data || error.message
    );
    const serverMessage = error.response?.data?.message;
    const validationErrors = error.response?.data?.errors;

    let errorMessage = serverMessage || 'Terjadi kesalahan sistem.';
    if (validationErrors) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      if (firstErrorKey)
        errorMessage = validationErrors[firstErrorKey][0] || errorMessage;
    }
    showAlert({
      type: 'error',
      title: 'Error',
      message: errorMessage,
    });
  } finally {
    setLoading(false);
  }
};

const handleResendAction = async (
  phoneNumber: string,
  { setLoading, setCurrentOtp, showAlert, source }: any
) => {
  setLoading(true);
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const cleanPhone = normalizeAciPhoneNumber(phoneNumber);
    const response =
      source === 'forgot-password'
        ? await aciSendOtpReset({
            no_wa: cleanPhone,
            otp: newOtp,
          })
        : await aciSendOtp({
            no_wa: normalizeTo62(phoneNumber),
            otp: newOtp,
          });

    if (response.status) {
      setCurrentOtp(newOtp);
      showAlert({
        type: 'success',
        title: 'Berhasil',
        message: 'Kode OTP baru telah dikirim.',
      });
      return true;
    }
    showAlert({
      type: 'error',
      title: 'Gagal',
      message: response.message || 'Gagal mengirim ulang OTP.',
    });
    return false;
  } catch (error: any) {
    showAlert({
      type: 'error',
      title: 'Error',
      message: error.response?.data?.message || 'Terjadi kesalahan koneksi.',
    });
    return false;
  } finally {
    setLoading(false);
  }
};

const handleVerifyAction = async (
  params: any,
  { otpInput, currentOtp }: { otpInput: string; currentOtp: string },
  { router, showAlert, setLoading }: any
) => {
  if (params.source === 'forgot-password') {
    if (!otpInput || otpInput.length < 6) {
      showAlert({
        type: 'warning',
        title: 'Peringatan',
        message: 'Harap masukkan 6 digit kode OTP.',
      });
      return;
    }

    if (currentOtp && otpInput !== currentOtp) {
      showAlert({
        type: 'error',
        title: 'Gagal',
        message: 'OTP yang Anda masukkan salah.',
      });
      return;
    }

    router.replace({
      pathname: '/pelayanan-publik/aci/reset-password',
      params: { phoneNumber: params.phoneNumber, otp: otpInput },
    });
    return;
  }

  if (!otpInput || otpInput.length < 6) {
    showAlert({
      type: 'warning',
      title: 'Peringatan',
      message: 'Harap masukkan 6 digit kode OTP.',
    });
    return;
  }

  if (otpInput !== currentOtp) {
    showAlert({
      type: 'error',
      title: 'Gagal',
      message: 'OTP yang Anda masukkan salah.',
    });
    return;
  }

  if (params.source === 'register-otp') {
    router.replace({
      pathname: '/pelayanan-publik/aci/register',
      params: {
        ...params,
        isPhoneVerified: 'true',
      },
    });
    return;
  }

  await handleRegistrationAction(params, {
    showAlert,
    setLoading,
    router,
  });
};

export const useVerificationLogic = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber: string;
    name: string;
    nik: string;
    password?: string;
    otp?: string;
    source?: string;
    email?: string;
    userId?: string;
  }>();

  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { alertConfig, showAlert, hideAlert } = useAciAlert();
  const [currentOtp, setCurrentOtp] = useState(params.otp || '');

  const handleResendOtp = () =>
    handleResendAction(params.phoneNumber!, {
      setLoading,
      setCurrentOtp,
      showAlert,
      source: params.source,
    });

  const handleVerify = () =>
    handleVerifyAction(
      params,
      { otpInput, currentOtp },
      {
        router,
        showAlert,
        setLoading,
      }
    );

  return {
    otpInput,
    setOtpInput,
    handleVerify,
    handleResendOtp,
    alertConfig,
    hideAlert,
    loading,
    phoneNumber: params.phoneNumber,
  };
};

export default function Ignored() {
  return null;
}
