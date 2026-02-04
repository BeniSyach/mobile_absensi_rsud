import { useCallback } from 'react';

import { useAciAlert } from './use-aci-alert';

export const useRegisterNotification = () => {
  const { alertConfig, showAlert, hideAlert } = useAciAlert();

  const showValidationAlert = useCallback(
    (errors: string[]) => {
      console.log(
        'useRegisterNotification: showValidationAlert called with errors=',
        errors
      );
      showAlert({
        type: 'error',
        title: 'Data Belum Lengkap',
        message: 'Mohon periksa kembali data yang anda masukan.',
        errorList: errors,
        autoCloseMillis: 1300,
        showConfirmButton: false,
      });
    },
    [showAlert]
  );

  const showRegistrationSuccess = useCallback(() => {
    showAlert({
      type: 'success',
      title: 'Sukses',
      message: 'Registrasi berhasil. Silakan masuk dengan akun Anda.',
      autoCloseMillis: 2000,
      showConfirmButton: false,
    });
  }, [showAlert]);

  const showRegistrationError = useCallback(
    (message: string) => {
      showAlert({
        type: 'error',
        title: 'Gagal',
        message: message || 'Gagal mendaftar. Silakan coba lagi.',
        autoCloseMillis: 1500,
        showConfirmButton: false,
      });
    },
    [showAlert]
  );

  const showConnectionError = useCallback(
    (message?: string) => {
      showAlert({
        type: 'error',
        title: 'Error',
        message: message || 'Terjadi kesalahan koneksi.',
        autoCloseMillis: 1500,
        showConfirmButton: false,
      });
    },
    [showAlert]
  );

  return {
    alertConfig,
    hideAlert,
    showValidationAlert,
    showRegistrationSuccess,
    showRegistrationError,
    showConnectionError,
  };
};

export default function Ignored() {
  return null;
}
