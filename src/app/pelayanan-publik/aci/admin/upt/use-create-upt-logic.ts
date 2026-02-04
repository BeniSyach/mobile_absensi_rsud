import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { createAciUpt } from '../../aci-service';

// Helper to handle UPT creation
const handleCreateUpt = async ({
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
      message: 'Nama UPT wajib diisi.',
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

    await createAciUpt(token, { nama_upt: name });

    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'UPT berhasil dibuat.',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((prev: any) => ({ ...prev, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Create UPT failed', error);
    console.log(
      'Error details:',
      JSON.stringify(error.response?.data, null, 2)
    );
    const msg = error?.response?.data?.message || 'Gagal membuat UPT';
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

export const useCreateUptLogic = () => {
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
    handleCreateUpt({ name, setLoading, setAlertConfig, router });
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
