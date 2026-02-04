import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import {
  type AciKategori,
  type AciKecamatan,
  type AciKelurahan,
  createAciLaporan,
  getAciKategoris,
  getAciKecamatans,
  getAciKelurahans,
} from '../../aci-service';
import { updateAciLaporanStatus } from '../../aci-service-update-status';

const TITLES = [
  'Jalan Berlubang di Area Pasar',
  'Penerangan Jalan Padam',
  'Sampah Menumpuk di Drainase',
  'Pohon Tumbang Menghalangi Jalan',
  'Lampu Lalu Lintas Rusak',
  'Saluran Air Tersumbat',
  'Trotoar Rusak Berat',
  'Fasilitas Taman Tidak Terawat',
  'Papan Reklame Hampir Roboh',
  'Pencemaran Limbah di Parit',
];

const DESCRIPTIONS = [
  'Mohon segera diperbaiki karena membahayakan pengendara yang melintas.',
  'Sudah terjadi selama 3 hari namun belum ada tindakan dari pihak terkait.',
  'Menyebabkan bau tidak sedap dan potensi sarang penyakit.',
  'Sangat mendesak, mohon tim teknis segera terjun ke lokasi.',
  'Kondisinya semakin parah setiap kali hujan turun di wilayah ini.',
];

const getRandomItem = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const fetchBaseData = async (token: string) => {
  const [kategoriRes, kecamatanRes] = await Promise.all([
    getAciKategoris(token, { per_page: 100 }),
    getAciKecamatans(token, { per_page: 100 }),
  ]);

  const kategoris: AciKategori[] = kategoriRes.data || [];
  const districts: AciKecamatan[] = Array.isArray(kecamatanRes)
    ? kecamatanRes
    : kecamatanRes.data || [];

  if (
    kategoris.length === 0 ||
    (Array.isArray(districts) && districts.length === 0)
  ) {
    throw new Error('Data kategori atau kecamatan tidak ditemukan.');
  }

  return { kategoris, districts };
};

const createSingleReport = async (params: {
  token: string;
  kategoris: AciKategori[];
  districts: AciKecamatan[];
  _index: number;
}) => {
  const { token, kategoris, districts } = params;
  const randomKategori = getRandomItem(kategoris);
  const randomKecamatan = getRandomItem(districts);
  const title = getRandomItem(TITLES);
  const desc = getRandomItem(DESCRIPTIONS);

  const kelurahanRes = await getAciKelurahans(token, randomKecamatan.id, {
    per_page: 100,
  });
  const kelurahans: AciKelurahan[] = Array.isArray(kelurahanRes)
    ? kelurahanRes
    : kelurahanRes.data || [];

  if (kelurahans.length === 0) {
    console.warn(
      `No kelurahan found for kecamatan ${randomKecamatan.id}, skipping...`
    );
    return;
  }

  const randomKelurahan = getRandomItem(kelurahans);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const payload: any = {
    kategori_laporan_id: randomKategori.id,
    judul: title,
    deskripsi: desc,
    kecamatan_id: randomKecamatan.id,
    kelurahan_id: randomKelurahan.id,
    alamat: `Jalan Beringin No. ${Math.floor(Math.random() * 100)}, ${
      randomKecamatan.nm_kecamatan ||
      randomKecamatan.nama_kecamatan ||
      randomKecamatan.name ||
      randomKecamatan.nama ||
      'Deli Serdang'
    }`,
    latitude: '3.5952',
    longitude: '98.6722',
    tanggal_laporan: dateStr,
    created_at: now.toISOString(),
    prioritas: getRandomItem(['rendah', 'sedang', 'tinggi']),
  };

  console.log('Dummy payload:', JSON.stringify(payload, null, 2));

  const createRes = await createAciLaporan(token, payload);
  const reportId = createRes?.data?.id || createRes?.id;

  const randomStatus = Math.floor(Math.random() * 6); // 0-5
  if (randomStatus > 0 && reportId) {
    await updateAciLaporanStatus(token, reportId, {
      status_laporan: randomStatus,
      penerima_keterangan: 'Diterima oleh sistem otomatis.',
      verif_keterangan: 'Terverifikasi otomatis by dummy generator.',
      penanganan_keterangan: 'Sedang dalam penanganan tim teknis ACI.',
      selesai_keterangan: 'Pekerjaan selesai dilakukan oleh petugas.',
    });
  }
};

export const useDummyLogic = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const generateDummyReports = useCallback(async (count: number) => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token) return;

      const { kategoris, districts } = await fetchBaseData(token);
      setProgress({ current: 0, total: count });

      for (let i = 0; i < count; i++) {
        await createSingleReport({ token, kategoris, districts, _index: i });
        setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
      }

      Alert.alert('Sukses', `${count} laporan dummy berhasil dibuat.`);
    } catch (error: any) {
      console.error('Generate dummy error:', error);
      Alert.alert('Error', error.message || 'Gagal membuat laporan dummy.');
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  }, []);

  return { loading, progress, generateDummyReports };
};

export default function Ignored() {
  return null;
}
