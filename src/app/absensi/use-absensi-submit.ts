import { useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import type { FormType } from '@/components/absensi/absensi-form';
import { showErrorMessage } from '@/components/ui';
import { getMessage, type UserData } from '@/lib/message-storage';

export const useAbsensiSubmit = (addPost: any, addPostPulang: any) => {
  const [message, setMessage] = useState<UserData | null>(null);

  // Mengambil pesan dari storage saat komponen dimuat
  useEffect(() => {
    const storedMessage = getMessage();
    if (storedMessage) {
      setMessage(storedMessage);
    }
  }, []);

  return (data: FormType) => {
    const commonPayload = {
      user_id: message?.id,
      shift_id: parseInt(data.shift),
      waktu_kerja_id: parseInt(data.hari_kerja),
      longitude: data.longitude,
      latitude: data.latitude,
      photo: data.photo,
    };

    if (data.tipe_absensi === 'Masuk') {
      addPost(commonPayload, {
        onSuccess: () =>
          showMessage({
            message: 'Absen Masuk Berhasil',
            type: 'success',
          }),
        onError: () => showErrorMessage('Error recording absen masuk'),
      });
    } else if (data.tipe_absensi === 'Pulang') {
      addPostPulang(
        { ...commonPayload, absen_masuk_id: message?.absen_masuk_id },
        {
          onSuccess: () =>
            showMessage({
              message: 'Absen Pulang Berhasil',
              type: 'success',
            }),
          onError: () => showErrorMessage('Error recording absen pulang'),
        }
      );
    } else {
      showErrorMessage('Invalid tipe absensi');
    }
  };
};
