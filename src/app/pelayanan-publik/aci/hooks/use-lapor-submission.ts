import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { createAciLaporan } from '../aci-service';

export const useLaporSubmission = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    const { judul, deskripsi, kategori_id } = formData;

    if (!judul || !deskripsi || !kategori_id) {
      Alert.alert(
        'Peringatan',
        'Harap isi judul, deskripsi, dan pilih kategori.'
      );
      return;
    }

    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token) throw new Error('No token found');

      await createAciLaporan(token, formData);

      Alert.alert('Berhasil', 'Laporan Anda telah berhasil dikirim.', [
        {
          text: 'OK',
          onPress: () => router.replace('/pelayanan-publik/aci/riwayat'),
        },
      ]);
    } catch (error: any) {
      console.error('Create laporan failed', error);
      Alert.alert(
        'Gagal',
        error.message || 'Gagal mengirim laporan. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSubmit };
};

export default function Ignored() {
  return null;
}
