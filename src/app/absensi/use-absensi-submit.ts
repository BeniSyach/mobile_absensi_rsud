import type { FormType } from '@/components/absensi/absensi-types';
import { getMessage } from '@/lib/message-storage';

export default function useAbsensiSubmit(
  addPost: (data: any) => Promise<any>,
  addPostPulang: (data: any) => Promise<any>
) {
  return async (data: FormType) => {
    const userData = getMessage();

    const commonPayload = {
      ...data,
      user_id: userData?.data.nik,
      kode_unit_kerja: userData?.data.unit_kerja_id,
    };

    if (data.tipe_absensi === '0') {
      // Absen masuk
      const response = await addPost(commonPayload);
      return response;
    }

    if (data.tipe_absensi === '1') {
      // Absen pulang
      const response = await addPostPulang(commonPayload);
      return response;
    }

    throw new Error('Invalid tipe absensi');
  };
}
