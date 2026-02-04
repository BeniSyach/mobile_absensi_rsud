import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { getAciUptDetail, updateAciUpt } from '../../../aci-service';
import { useAciAlert } from '../../../hooks/use-aci-alert';

// Helper to fetch UPT details
const fetchUptDetail = async ({
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

    const response = await getAciUptDetail(token, id);
    if (response.status === 200) {
      setName(response.data.nama_upt);
    }
  } catch (error) {
    console.error('Failed to fetch UPT detail', error);
    Alert.alert('Error', 'Gagal memuat data UPT');
    router.back();
  } finally {
    setLoading(false);
  }
};

// Helper to handle form submission
const handleUptSubmission = async ({
  id,
  name,
  setSubmitting,
  showAlert,
  router,
}: {
  id: string | undefined;
  name: string;
  setSubmitting: (loading: boolean) => void;
  showAlert: (config: any) => void;
  router: any;
}) => {
  if (!name.trim()) {
    showAlert({
      title: 'Validasi Gagal',
      message: 'Nama UPT wajib diisi.',
      type: 'error',
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

    await updateAciUpt(token, id, { nama_upt: name });

    showAlert({
      title: 'Sukses',
      message: 'Data UPT berhasil diperbarui.',
      type: 'success',
      onConfirm: () => {
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Update UPT failed', error);
    const msg = error?.response?.data?.message || 'Gagal memperbarui UPT';
    showAlert({
      title: 'Error',
      message: msg,
      type: 'error',
    });
  } finally {
    setSubmitting(false);
  }
};

export const useEditUptLogic = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { alertConfig, showAlert } = useAciAlert();

  useEffect(() => {
    fetchUptDetail({ id, setName, setLoading, router });
  }, [id, router]);

  const handleSubmit = () => {
    handleUptSubmission({ id, name, setSubmitting, showAlert, router });
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
