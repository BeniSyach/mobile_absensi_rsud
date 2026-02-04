import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { getAciSkpdDetail, updateAciSkpd } from '../../../aci-service';

// Helper to fetch SKPD details
const fetchSkpdDetail = async ({
  id,
  setName,
  setCode,
  setKepala,
  setNip,
  setLat,
  setLng,
  setLoading,
  router,
}: any) => {
  if (!id) return;
  try {
    const token = getItem<string>('aci_token');
    if (!token) return;
    const res = await getAciSkpdDetail(token, id);
    if (res.status === 200) {
      setName(res.data.nama_skpd);
      setCode(res.data.kode_skpd || '');
      setKepala(res.data.kepala_skpd || '');
      setNip(res.data.nip_kepala || '');
      setLat(res.data.latitude?.toString() || '');
      setLng(res.data.longitude?.toString() || '');
    }
  } catch (e) {
    Alert.alert('Error', 'Gagal memuat data SKPD');
    router.back();
  } finally {
    setLoading(false);
  }
};

const handleSkpdSubmission = async ({
  id,
  name,
  code,
  kepala,
  nip,
  lat,
  lng,
  setSubmitting,
  setAlertConfig,
  router,
}: any) => {
  if (!name.trim() || !code.trim()) {
    setAlertConfig({
      show: true,
      title: 'Validasi Gagal',
      message: 'Nama dan Kode wajib diisi.',
      type: 'error',
      onConfirm: () => setAlertConfig((p: any) => ({ ...p, show: false })),
    });
    return;
  }
  try {
    setSubmitting(true);
    const token = getItem<string>('aci_token');
    if (!token || !id) return Alert.alert('Error', 'Sesi kadaluarsa');
    await updateAciSkpd(token, id, {
      nama_skpd: name,
      kode_skpd: code,
      kepala_skpd: kepala,
      nip_kepala: nip,
      latitude: lat,
      longitude: lng,
    });
    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'Data diperbarui.',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((p: any) => ({ ...p, show: false }));
        router.back();
      },
    });
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Gagal memperbarui SKPD';
    setAlertConfig({
      show: true,
      title: 'Error',
      message: msg,
      type: 'error',
      onConfirm: () => setAlertConfig((p: any) => ({ ...p, show: false })),
    });
  } finally {
    setSubmitting(false);
  }
};

export const useEditSkpdLogic = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [kepala, setKepala] = useState('');
  const [nip, setNip] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
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
    fetchSkpdDetail({
      id,
      setName,
      setCode,
      setKepala,
      setNip,
      setLat,
      setLng,
      setLoading,
      router,
    });
  }, [id, router]);

  const handleSubmit = () => {
    handleSkpdSubmission({
      id,
      name,
      code,
      kepala,
      nip,
      lat,
      lng,
      setSubmitting,
      setAlertConfig,
      router,
    });
  };

  return {
    name,
    setName,
    code,
    setCode,
    kepala,
    setKepala,
    nip,
    setNip,
    lat,
    setLat,
    lng,
    setLng,
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
