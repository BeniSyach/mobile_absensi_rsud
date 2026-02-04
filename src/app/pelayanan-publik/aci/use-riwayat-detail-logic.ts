import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  type AciLaporan,
  deleteAciLaporan,
  getAciKategoriDetail,
  getAciKecamatans,
  getAciKelurahans,
  getAciLaporanDetail,
} from './aci-service';
import { useAciAlert } from './hooks/use-aci-alert';

const fetchRegionNames = async (
  token: string,
  kecamatanId?: number | null,
  kelurahanId?: number | null
) => {
  const result = { kecamatan: '', kelurahan: '' };

  if (kecamatanId) {
    try {
      const resKec = await getAciKecamatans(token, {
        search: String(kecamatanId),
      });
      const itemsKec = Array.isArray(resKec) ? resKec : resKec.data || [];
      const kec = itemsKec.find(
        (k: any) => String(k.id) === String(kecamatanId)
      ) as any;

      if (kec) {
        result.kecamatan =
          kec.nm_kecamatan || kec.nama_kecamatan || kec.name || kec.nama || '';
      }
    } catch (error) {
      console.error('Failed to fetch kecamatan:', error);
    }
  }

  if (kelurahanId && kecamatanId) {
    try {
      const resKel = await getAciKelurahans(token, kecamatanId, {
        search: String(kelurahanId),
      });
      const itemsKel = Array.isArray(resKel) ? resKel : resKel.data || [];

      const kel = itemsKel.find(
        (k: any) => String(k.id) === String(kelurahanId)
      ) as any;

      if (kel) {
        result.kelurahan =
          kel.nm_kelurahan ||
          kel.nama_kelurahan ||
          kel.name ||
          kel.nama ||
          kel.nm_desa ||
          kel.nama_desa ||
          '';
      }
    } catch (error) {
      console.error('Failed to fetch kelurahan:', error);
    }
  }

  return result;
};

const useReportDetail = (id: string | string[] | undefined) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<AciLaporan | null>(null);
  const [regionNames, setRegionNames] = useState({
    kecamatan: '',
    kelurahan: '',
  });

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token || !id) {
        setLoading(false);
        return;
      }

      const response = await getAciLaporanDetail(token, id as string);

      const reportData =
        (response as any).data ||
        ((response as any).id || (response as any).judul ? response : null);

      if (reportData) {
        setReport(reportData);
        // Resolve region names
        if (reportData.kecamatan_id) {
          const names = await fetchRegionNames(
            token,
            reportData.kecamatan_id,
            reportData.kelurahan_id
          );
          setRegionNames(names);
        }

        // Fetch category if missing
        if (
          !reportData.kategori &&
          (reportData.kategori_id || reportData.kategori_laporan_id)
        ) {
          fetchMissingCategory(token, reportData, setReport);
        }
      } else {
        console.warn('No report data found');
      }
    } catch (error) {
      console.error('Fetch report detail failed', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchDetail();
    }, [fetchDetail])
  );

  return { loading, report, regionNames, fetchDetail };
};

async function fetchMissingCategory(
  token: string,
  reportData: any,
  setReport: any
) {
  try {
    const catId = reportData.kategori_id || reportData.kategori_laporan_id;
    const catRes = await getAciKategoriDetail(token, catId);
    if (catRes && catRes.data) {
      setReport((prev: any) => ({
        ...prev,
        kategori: catRes.data,
      }));
    }
  } catch (e) {
    console.error('Failed to fetch missing category', e);
  }
}

const useDeleteReport = (
  id: string | string[] | undefined,
  router: any,
  showAlert: any
) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    showAlert({
      type: 'confirm',
      title: 'Hapus Laporan',
      message:
        'Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          setDeleting(true);
          const token = getItem<string>('aci_token');
          if (token && id) {
            await deleteAciLaporan(token, id as string);
            showAlert({
              type: 'success',
              title: 'Berhasil',
              message: 'Laporan berhasil dihapus',
              onConfirm: () => router.back(),
            });
          }
        } catch (error: any) {
          showAlert({
            type: 'error',
            title: 'Gagal',
            message: error.message || 'Gagal menghapus laporan',
          });
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  return { deleting, handleDelete };
};

export const useRiwayatDetailLogic = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { alertConfig, showAlert, hideAlert } = useAciAlert();
  const { loading, report, regionNames, fetchDetail } = useReportDetail(id);
  const { deleting, handleDelete } = useDeleteReport(id, router, showAlert);

  return {
    id,
    router,
    loading,
    deleting,
    report,
    regionNames,
    fetchDetail,
    handleDelete,
    alertConfig,
    hideAlert,
  };
};

export default function Ignored() {
  return null;
}
