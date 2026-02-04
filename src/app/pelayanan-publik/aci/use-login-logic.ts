import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import { getItem, removeItem, setItem } from '@/lib/storage';

import { aciLogin, normalizeAciPhoneNumber } from './aci-service';
import { useAciAlert } from './hooks/use-aci-alert';

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return keyboardHeight;
};

const validateLoginInputs = (
  activeTab: 'nomor_hp' | 'nik',
  identifier: string,
  pass: string
) => {
  const newErrors = { identifier: '', password: '' };
  let isValid = true;

  if (activeTab === 'nomor_hp' && identifier.length < 10) {
    newErrors.identifier = 'Nomor ponsel minimal 10 digit.';
    isValid = false;
  } else if (activeTab === 'nik' && identifier.length !== 16) {
    newErrors.identifier = 'NIK harus berjumlah 16 digit.';
    isValid = false;
  }

  if (!pass) {
    newErrors.password = 'Wajib diisi.';
    isValid = false;
  }

  return { isValid, newErrors };
};

const handleRoleRedirection = (user: any, router: any) => {
  const userRoles = user?.roles?.map((r: any) => r.name.toUpperCase()) || [];
  const isAdminRole = userRoles.some(
    (role: string) => role !== 'MASYARAKAT' && role !== ''
  );

  if (isAdminRole) {
    router.replace('/pelayanan-publik/aci/admin/dashboard');
  } else {
    router.replace('/pelayanan-publik/aci/dashboard');
  }
};

const executeLogin = async ({
  ident,
  pass,
  rememberMe,
  router,
  setIsLoading,
  showAlert,
}: {
  ident: string;
  pass: string;
  rememberMe: boolean;
  router: any;
  setIsLoading: (val: boolean) => void;
  showAlert: (config: any) => void;
}) => {
  setIsLoading(true);
  try {
    console.log(`Attempting login for: [${ident}]`);
    const response = await aciLogin({ login: ident, password: pass });
    if (response?.status) {
      await setItem('aci_token', response.token);
      await setItem('aci_user', response.user);
      await (rememberMe
        ? setItem('aci_saved_credentials', {
            identifier: ident,
            password: pass,
          })
        : removeItem('aci_saved_credentials'));
      handleRoleRedirection(response.user, router);
      return;
    }

    setIsLoading(false);
    Keyboard.dismiss();
    setTimeout(() => {
      showAlert({
        type: 'error',
        title: 'Gagal Masuk',
        message: 'Periksa kembali data login Anda.',
        showConfirmButton: false,
        autoCloseMillis: 1000,
      });
    }, 200);
  } catch (error: any) {
    setIsLoading(false);
    const responseData = error.response?.data;
    const msg =
      responseData?.message ||
      'Nomor HP/NIK atau kata sandi yang Anda masukkan salah.';
    const validationErrors = responseData?.errors
      ? (Object.values(responseData.errors).flat() as string[])
      : [];

    console.log('Login attempt failed:', msg);

    Keyboard.dismiss();
    setTimeout(() => {
      showAlert({
        type: 'error',
        title: 'Gagal Masuk',
        message: msg,
        errorList: validationErrors,
        showConfirmButton: false,
        autoCloseMillis: 1000,
      });
    }, 200);
  }
};

const useLoadSavedCredentials = (
  setIdentifier: (val: string) => void,
  setPassword: (val: string) => void,
  setRememberMe: (val: boolean) => void
) => {
  useEffect(() => {
    const saved = getItem<{ identifier: string; password: string }>(
      'aci_saved_credentials'
    );
    if (saved) {
      setIdentifier(saved.identifier);
      setPassword(saved.password);
      setRememberMe(true);
    }
  }, [setIdentifier, setPassword, setRememberMe]);
};

export const useLoginLogic = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'nomor_hp' | 'nik'>('nomor_hp');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const keyboardHeight = useKeyboardHeight();
  const { alertConfig, hideAlert, showAlert } = useAciAlert();

  useLoadSavedCredentials(setIdentifier, setPassword, setRememberMe);

  const handleIdentifierChange = (val: string) => {
    setIdentifier(val);
    if (errors.identifier) setErrors({ ...errors, identifier: '' });
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errors.password) setErrors({ ...errors, password: '' });
  };

  const handleLogin = async () => {
    const { isValid, newErrors } = validateLoginInputs(
      activeTab,
      identifier,
      password
    );
    setErrors(newErrors);

    if (isValid) {
      const identValue =
        activeTab === 'nomor_hp'
          ? normalizeAciPhoneNumber(identifier)
          : identifier;

      await executeLogin({
        ident: identValue,
        pass: password,
        rememberMe,
        router,
        setIsLoading,
        showAlert,
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    identifier,
    setIdentifier: handleIdentifierChange,
    password,
    setPassword: handlePasswordChange,
    errors,
    isLoading,
    keyboardHeight,
    handleLogin,
    alertConfig,
    hideAlert,
  };
};

export default function Ignored() {
  return null;
}
