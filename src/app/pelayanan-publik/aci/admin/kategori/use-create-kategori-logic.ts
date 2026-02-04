import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { createAciKategori } from '../../aci-service';

// Helper to handle Kategori creation
const handleCreateKategori = async ({
  name,
  setLoading,
  setAlertConfig,
  router,
}: {
  name: string;
  setLoading: (loading: boolean) => void;
  setAlertConfig: (config: any) => void;
  router: any;
}) => {
  if (!name.trim()) {
    setAlertConfig({
      show: true,
      title: 'Validasi Gagal',
      message: 'Nama kategori wajib diisi.',
      type: 'error',
      onConfirm: () =>
        setAlertConfig((prev: any) => ({ ...prev, show: false })),
    });
    return;
  }

  try {
    setLoading(true);
    const token = getItem<string>('aci_token');
    if (!token) {
      Alert.alert('Error', 'Sesi kadaluarsa');
      return;
    }

    await createAciKategori(token, { nm_kategori: name });

    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'Kategori berhasil dibuat.',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((prev: any) => ({ ...prev, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Create Kategori failed', error);
    const msg = error?.response?.data?.message || 'Gagal membuat Kategori';
    setAlertConfig({
      show: true,
      title: 'Error',
      message: msg,
      type: 'error',
      onConfirm: () =>
        setAlertConfig((prev: any) => ({ ...prev, show: false })),
    });
  } finally {
    setLoading(false);
  }
};

export const useCreateKategoriLogic = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
    onConfirm: () => {},
  });

  const handleSubmit = () => {
    handleCreateKategori({ name, setLoading, setAlertConfig, router });
  };

  return {
    name,
    setName,
    loading,
    alertConfig,
    handleSubmit,
    router,
  };
};

export default function Ignored() {
  return null;
}
