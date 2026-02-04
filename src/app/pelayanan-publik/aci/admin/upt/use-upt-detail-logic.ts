import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import { type AciUpt, deleteAciUpt, getAciUptDetail } from '../../aci-service';
import { useAciAlert } from '../../hooks/use-aci-alert';

export const useUptDetailLogic = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [upt, setUpt] = useState<AciUpt | null>(null);
  const [loading, setLoading] = useState(true);
  const { alertConfig, showAlert } = useAciAlert();

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token || !id) return;

      const response = await getAciUptDetail(token, id);
      if (response.status === 200) {
        setUpt(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch UPT detail', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Gagal memuat detail UPT',
      });
    } finally {
      setLoading(false);
    }
  }, [id, showAlert]);

  useFocusEffect(
    useCallback(() => {
      fetchDetail();
    }, [fetchDetail])
  );

  const handleDelete = () => {
    showAlert({
      type: 'confirm',
      title: 'Hapus UPT',
      message:
        'Apakah Anda yakin ingin menghapus UPT ini? Tindakan ini tidak dapat dibatalkan.',
      onConfirm: async () => {
        try {
          const token = getItem<string>('aci_token');
          if (!token || !id) return;
          await deleteAciUpt(token, id);
          showAlert({
            type: 'success',
            title: 'Sukses',
            message: 'UPT berhasil dihapus',
            onConfirm: () => router.back(),
          });
        } catch (error: any) {
          const msg = error?.response?.data?.message || 'Gagal menghapus UPT';
          showAlert({ type: 'error', title: 'Error', message: msg });
        }
      },
    });
  };

  return {
    upt,
    loading,
    handleDelete,
    router,
    id,
    alertConfig,
  };
};

export default function Ignored() {
  return null;
}
