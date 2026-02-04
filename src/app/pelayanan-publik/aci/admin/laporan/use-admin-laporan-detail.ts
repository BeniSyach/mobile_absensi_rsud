import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  getAciKategoriDetail,
  getAciKecamatans,
  getAciKelurahans,
  getAciLaporanDetail,
  getAciMasyarakatDetail,
  getAciUserDetail,
} from '../../aci-service';
import { useAciAlert } from '../../hooks/use-aci-alert';

async function resolveRegionNames(
  token: string,
  kecamatanId: any,
  kelurahanId: any
) {
  let kecName = '';
  let kelName = '';

  if (kecamatanId) {
    try {
      const resKec = await getAciKecamatans(token, {
        search: String(kecamatanId),
      });
      const itemsKec = Array.isArray(resKec) ? resKec : resKec.data || [];
      const kec = itemsKec.find(
        (k: any) => String(k.id) === String(kecamatanId)
      );
      if (kec) {
        kecName =
          kec.nm_kecamatan || kec.nama_kecamatan || kec.name || kec.nama || '';
      }
    } catch (e: any) {
      if (e.response?.status !== 403) {
        console.log('Error fetching kecamatan name', e.message);
      }
    }
  }

  if (kelurahanId && kecamatanId) {
    try {
      const resKel = await getAciKelurahans(token, Number(kecamatanId), {
        search: String(kelurahanId),
      });
      const itemsKel = Array.isArray(resKel) ? resKel : resKel.data || [];
      const kel = itemsKel.find(
        (k: any) => String(k.id) === String(kelurahanId)
      );
      if (kel) {
        kelName =
          kel.nama_kelurahan ||
          kel.nm_kelurahan ||
          kel.name ||
          kel.nama ||
          kel.nm_desa ||
          kel.nama_desa ||
          '';
      }
    } catch (e: any) {
      if (e.response?.status !== 403) {
        console.log('Error fetching kelurahan name', e.message);
      }
    }
  }

  return { kecamatan: kecName, kelurahan: kelName };
}

export const useAdminLaporanDetail = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [regionNames, setRegionNames] = useState({
    kecamatan: '',
    kelurahan: '',
  });
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const { alertConfig, showAlert } = useAciAlert();

  useEffect(() => {
    const storedUser = getItem<any>('aci_user');
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token || !id) return;

      const response = await getAciLaporanDetail(token, id as string);
      const data = response.data;
      setReport(data);

      await Promise.allSettled([
        resolveRegionNames(token, data.kecamatan_id, data.kelurahan_id).then(
          (names) => setRegionNames(names)
        ),
        fetchMissingCategory(token, data, setReport),
        fetchMissingUser(token, data, setReport),
      ]);
    } catch (error) {
      console.error('Fetch detail error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleUpdateSuccess = () => {
    showAlert({
      type: 'success',
      title: 'Berhasil',
      message: 'Status laporan berhasil diperbarui',
    });
    fetchDetail();
  };

  const goBack = () => router.back();

  return {
    loading,
    report,
    user,
    regionNames,
    updateModalVisible,
    setUpdateModalVisible,
    handleUpdateSuccess,
    goBack,
    alertConfig,
  };
};

async function fetchMissingCategory(token: string, data: any, setReport: any) {
  const reportData = data as any;
  if (
    !reportData.kategori &&
    (reportData.kategori_id || reportData.kategori_laporan_id)
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
    } catch (e: any) {
      if (e.response?.status !== 403) {
        console.error('Failed to fetch missing category', e.message);
      }
    }
  }
}

async function fetchMissingUser(token: string, data: any, setReport: any) {
  const reportData = data as any;
  if (!reportData.user && reportData.user_id) {
    try {
      // Try /api/users first as requested
      const userRes = await getAciUserDetail(token, String(reportData.user_id));
      if (userRes && userRes.data) {
        setReport((prev: any) => ({
          ...prev,
          user: userRes.data,
        }));
        return;
      }
    } catch (e) {
      // console.log('Not found in /api/users, trying masyarakat...');
    }

    try {
      // Fallback to /api/pengguna
      const userRes = await getAciMasyarakatDetail(
        token,
        String(reportData.user_id)
      );
      if (userRes && userRes.data) {
        setReport((prev: any) => ({
          ...prev,
          user: userRes.data,
        }));
      }
    } catch (e: any) {
      if (e.response?.status !== 403) {
        console.error('Failed to fetch missing user', e.message);
      }
    }
  }
}

export default function Ignored() {
  return null;
}
