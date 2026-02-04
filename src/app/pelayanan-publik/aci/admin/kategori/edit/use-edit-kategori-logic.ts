import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { getAciKategoriDetail, updateAciKategori } from '../../../aci-service';

// Helper to fetch Kategori details
const fetchKategoriDetail = async ({
  id,
  setName,
  setLoading,
  router,
}: {
  id: string | undefined;
  setName: (name: string) => void;
  setLoading: (loading: boolean) => void;
  router: any;
}) => {
  if (!id) return;
  try {
    const token = getItem<string>('aci_token');
    if (!token) return;

    const response = await getAciKategoriDetail(token, id);
    if (response.status === 200) {
      setName(
        response.data.nm_kategori ||
          response.data.nama_kategori ||
          (response.data as any).nama ||
          (response.data as any).name ||
          ''
      );
    }
  } catch (error) {
    console.error('Failed to fetch Kategori detail', error);
    Alert.alert('Error', 'Gagal memuat data Kategori');
    router.back();
  } finally {
    setLoading(false);
  }
};

// Helper to handle form submission
const handleKategoriSubmission = async ({
  id,
  name,
  setSubmitting,
  setAlertConfig,
  router,
}: {
  id: string | undefined;
  name: string;
  setSubmitting: (loading: boolean) => void;
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
    setSubmitting(true);
    const token = getItem<string>('aci_token');
    if (!token || !id) {
      Alert.alert('Error', 'Sesi kadaluarsa');
      return;
    }

    await updateAciKategori(token, id, { nm_kategori: name });

    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'Data Kategori berhasil diperbarui.',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((prev: any) => ({ ...prev, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Update Kategori failed', error);
    const msg = error?.response?.data?.message || 'Gagal memperbarui Kategori';
    setAlertConfig({
      show: true,
      title: 'Error',
      message: msg,
      type: 'error',
      onConfirm: () =>
        setAlertConfig((prev: any) => ({ ...prev, show: false })),
    });
  } finally {
    setSubmitting(false);
  }
};

export const useEditKategoriLogic = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchKategoriDetail({ id, setName, setLoading, router });
  }, [id, router]);

  const handleSubmit = () => {
    handleKategoriSubmission({
      id,
      name,
      setSubmitting,
      setAlertConfig,
      router,
    });
  };

  return {
    name,
    setName,
    loading,
    submitting,
    alertConfig,
    handleSubmit,
    router,
  };
};

export default function Ignored() {
  return null;
}
