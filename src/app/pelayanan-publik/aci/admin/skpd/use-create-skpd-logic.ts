import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { createAciSkpd } from '../../aci-service';

// Helper to handle SKPD creation
const handleCreateSkpd = async ({
  name,
  code,
  kepala,
  nip,
  lat,
  lng,
  setLoading,
  setAlertConfig,
  router,
}: {
  name: string;
  code: string;
  kepala: string;
  nip: string;
  lat: string;
  lng: string;
  setLoading: (l: boolean) => void;
  setAlertConfig: (c: any) => void;
  router: any;
}) => {
  if (!name.trim() || !code.trim()) {
    setAlertConfig({
      show: true,
      title: 'Validasi Gagal',
      message: 'Nama dan Kode SKPD wajib diisi.',
      type: 'error',
      onConfirm: () => setAlertConfig((p: any) => ({ ...p, show: false })),
    });
    return;
  }
  try {
    setLoading(true);
    const token = getItem<string>('aci_token');
    if (!token) return Alert.alert('Error', 'Sesi kadaluarsa');
    await createAciSkpd(token, {
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
      message: 'SKPD berhasil dibuat.',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((p: any) => ({ ...p, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    const msg = error?.response?.data?.message || 'Gagal membuat SKPD';
    setAlertConfig({
      show: true,
      title: 'Error',
      message: msg,
      type: 'error',
      onConfirm: () => setAlertConfig((p: any) => ({ ...p, show: false })),
    });
  } finally {
    setLoading(false);
  }
};

export const useCreateSkpdLogic = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [kepala, setKepala] = useState('');
  const [nip, setNip] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
    onConfirm: () => {},
  });

  const handleSubmit = () => {
    handleCreateSkpd({
      name,
      code,
      kepala,
      nip,
      lat,
      lng,
      setLoading,
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
    alertConfig,
    handleSubmit,
    router,
  };
};

export default function Ignored() {
  return null;
}
