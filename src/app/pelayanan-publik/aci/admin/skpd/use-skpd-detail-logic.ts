import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  type AciSkpd,
  deleteAciSkpd,
  getAciSkpdDetail,
} from '../../aci-service';
import { useAciAlert } from '../../hooks/use-aci-alert';

export const useSkpdDetailLogic = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [skpd, setSkpd] = useState<AciSkpd | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { alertConfig, showAlert } = useAciAlert();

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token || !id) return;
      const res = await getAciSkpdDetail(token, id);
      if (res.status === 200) setSkpd(res.data);
    } catch (e) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Gagal memuat detail SKPD',
        onConfirm: () => router.back(),
      });
    } finally {
      setLoading(false);
    }
  }, [id, router, showAlert]);

  useFocusEffect(
    useCallback(() => {
      fetchDetail();
    }, [fetchDetail])
  );

  const handleDelete = () => {
    showAlert({
      type: 'confirm',
      title: 'Konfirmasi',
      message: 'Hapus SKPD ini?',
      onConfirm: async () => {
        try {
          setDeleting(true);
          const token = getItem<string>('aci_token');
          if (!token || !id) return;
          await deleteAciSkpd(token, id);
          showAlert({
            type: 'success',
            title: 'Sukses',
            message: 'SKPD berhasil dihapus',
            onConfirm: () => router.back(),
          });
        } catch (e: any) {
          showAlert({
            type: 'error',
            title: 'Error',
            message: e?.response?.data?.message || 'Gagal',
          });
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  return { skpd, loading, deleting, handleDelete, router, id, alertConfig };
};

export default function Ignored() {
  return null;
}
