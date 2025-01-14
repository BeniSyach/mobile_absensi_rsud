import { showMessage } from 'react-native-flash-message';

import type { FormType } from '@/components/absensi/absensi-form';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function useAbsensiSubmit(addPost: any, addPostPulang: any) {
  return (data: FormType) => {
    const userData = getMessage();
    const commonPayload = {
      ...data,
      user_id: userData?.id,
    };

    return new Promise<void>((resolve, reject) => {
      if (data.tipe_absensi === '0') {
        addPost(commonPayload, {
          onSuccess: () => {
            showMessage({
              message: 'Absen Masuk Berhasil',
              type: 'success',
            });
            resolve();
          },
          onError: (error: any) => {
            showErrorMessage('Error recording absen masuk');
            reject(error);
          },
        });
      } else if (data.tipe_absensi === '1') {
        addPostPulang(
          { ...commonPayload },
          {
            onSuccess: () => {
              showMessage({
                message: 'Absen Pulang Berhasil',
                type: 'success',
              });
              resolve();
            },
            onError: (error: any) => {
              showErrorMessage('Error recording absen pulang');
              reject(error);
            },
          }
        );
      } else {
        showErrorMessage('Invalid tipe absensi');
        reject(new Error('Invalid tipe absensi'));
      }
    });
  };
}
