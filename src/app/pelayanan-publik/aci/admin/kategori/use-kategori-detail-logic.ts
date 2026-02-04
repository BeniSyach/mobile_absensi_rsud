import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  type AciKategori,
  deleteAciKategori,
  getAciKategoriDetail,
} from '../../aci-service';
import { useAciAlert } from '../../hooks/use-aci-alert';

export const useKategoriDetailLogic = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [kategori, setKategori] = useState<AciKategori | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { alertConfig, showAlert } = useAciAlert();

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token || !id) return;
      const response = await getAciKategoriDetail(token, id);
      if (response.status === 200) setKategori(response.data);
    } catch (error) {
      console.error('Failed to fetch Kategori detail', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Gagal memuat detail Kategori',
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
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus kategori ini?',
      onConfirm: async () => {
        try {
          setDeleting(true);
          const token = getItem<string>('aci_token');
          if (!token || !id) return;
          await deleteAciKategori(token, id);
          showAlert({
            type: 'success',
            title: 'Sukses',
            message: 'Kategori berhasil dihapus',
            onConfirm: () => router.back(),
          });
        } catch (error: any) {
          const msg =
            error?.response?.data?.message || 'Gagal menghapus Kategori';
          showAlert({ type: 'error', title: 'Error', message: msg });
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  return { kategori, loading, deleting, handleDelete, router, id, alertConfig };
};

export default function Ignored() {
  return null;
}
