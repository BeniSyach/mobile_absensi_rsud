import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  aciRegister,
  aciSendOtp,
  normalizeAciPhoneNumber,
  normalizeTo62,
} from './aci-service';
import { useRegisterNotification } from './hooks/use-register-notification';

const validateRegistration = ({
  name,
  nik,
  phoneNumber,
  password,
  confirmPassword,
  email,
}: {
  name: string;
  nik: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  email: string;
}) => {
  const newErrors: Record<string, string> = {};

  if (!name.trim()) {
    newErrors.name = 'Wajib diisi.';
  }

  if (!nik || nik.length !== 16) {
    newErrors.nik = 'NIK harus berjumlah 16 digit.';
  }

  if (!phoneNumber || phoneNumber.length < 10) {
    newErrors.phoneNumber = 'Nomor ponsel minimal 10 digit.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    newErrors.email = 'Format email tidak valid.';
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    newErrors.password = 'Min. 8 karakter, 1 huruf kapil, 1 angka, 1 simbol.';
  }

  if (password !== confirmPassword) {
    newErrors.confirmPassword = 'kata sandi harus sama';
  }

  return newErrors;
};

const useLoadInitialData = () => {
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const params = useLocalSearchParams<{
    name?: string;
    nik?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    isPhoneVerified?: string;
  }>();

  useEffect(() => {
    if (params.name) setName(params.name);
    if (params.nik) setNik(params.nik);
    if (params.phoneNumber) setPhoneNumber(params.phoneNumber);
    if (params.email) setEmail(params.email);
    if (params.password) {
      setPassword(params.password);
      setConfirmPassword(params.password);
    }
    if (params.isPhoneVerified === 'true') setIsPhoneVerified(true);
  }, [params]);

  return {
    name,
    setName,
    nik,
    setNik,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    agree,
    setAgree,
    errors,
    setErrors,
    isOtpSending,
    setIsOtpSending,
    isPhoneVerified,
    setIsPhoneVerified,
  };
};

const handleRegisterAction = async (
  formData: any,
  {
    router,
    showValidationAlert,
    showRegistrationError,
    showConnectionError,
    showRegistrationSuccess,
    setErrors,
  }: any
) => {
  const {
    name,
    nik,
    phoneNumber,
    email,
    password,
    confirmPassword,
    agree,
    isPhoneVerified,
  } = formData;
  const newErrors = validateRegistration({
    name,
    nik,
    phoneNumber,
    email,
    password,
    confirmPassword,
  });
  setErrors(newErrors);

  const errorMessages = Object.values(newErrors);
  if (!agree) errorMessages.push('Harap setujui S&K serta Kebijakan Privasi');

  if (errorMessages.length > 0) {
    showValidationAlert(errorMessages);
    return;
  }

  if (!isPhoneVerified) {
    showValidationAlert(['Silakan verifikasi nomor HP Anda terlebih dahulu']);
    return;
  }

  try {
    const response = await aciRegister({
      name,
      nik,
      no_wa: normalizeAciPhoneNumber(phoneNumber),
      email,
      password,
      password_confirmation: confirmPassword,
    });

    if (response.status) {
      showRegistrationSuccess();
      setTimeout(() => {
        router.dismissAll();
        router.replace('/pelayanan-publik/aci');
      }, 2000);
    } else {
      showRegistrationError(response.message || 'Registrasi gagal.');
    }
  } catch (error: any) {
    showConnectionError(error.response?.data?.message);
  }
};

const handleSendOtpAction = async (
  state: any,
  { router, showRegistrationError, showConnectionError }: any
) => {
  if (!state.phoneNumber || state.phoneNumber.length < 10) {
    state.setErrors((prev: any) => ({
      ...prev,
      phoneNumber: 'Nomor ponsel minimal 10 digit.',
    }));
    return;
  }

  state.setIsOtpSending(true);
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const normalizedPhone = normalizeAciPhoneNumber(state.phoneNumber);

  try {
    const response = await aciSendOtp({
      no_wa: normalizeTo62(state.phoneNumber),
      otp: generatedOtp,
    });

    if (response.status) {
      router.push({
        pathname: '/pelayanan-publik/aci/verification',
        params: {
          phoneNumber: normalizedPhone,
          name: state.name,
          nik: state.nik,
          email: state.email,
          password: state.password,
          otp: generatedOtp,
          source: 'register-otp',
        },
      });
    } else {
      showRegistrationError(response.message);
    }
  } catch (error: any) {
    showConnectionError(error.response?.data?.message);
  } finally {
    state.setIsOtpSending(false);
  }
};

export const useRegisterLogic = () => {
  const router = useRouter();
  const state = useLoadInitialData();
  const {
    alertConfig,
    hideAlert,
    showValidationAlert,
    showRegistrationError,
    showConnectionError,
    showRegistrationSuccess,
  } = useRegisterNotification();

  const handleRegister = () =>
    handleRegisterAction(
      { ...state },
      {
        router,
        showValidationAlert,
        showRegistrationError,
        showConnectionError,
        showRegistrationSuccess,
        setErrors: state.setErrors,
      }
    );

  const handleSendOtp = () =>
    handleSendOtpAction(state, {
      router,
      showRegistrationError,
      showConnectionError,
    });

  return {
    ...state,
    handleRegister,
    handleSendOtp,
    alertConfig,
    hideAlert,
  };
};

export default function Ignored() {
  return null;
}
