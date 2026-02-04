import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import {
  type AciKategori,
  type AciKecamatan,
  type AciKelurahan,
  type AciUpdateLaporanPayload,
  getAciKategoris,
  getAciKecamatans,
  getAciKelurahans,
  getAciLaporanDetail,
  updateAciLaporan,
} from '../../aci-service';
import { useAciAlert } from '../../hooks/use-aci-alert';
import { setLocationListener } from '../../location-store';
import { compressImageIfNeeded } from '../../utils/image-utils';

const useCategories = () => {
  const [categories, setCategories] = useState<AciKategori[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const token = getItem<string>('aci_token');
      if (!token) return;
      const res = await getAciKategoris(token, { per_page: 100 });
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loadingCategories };
};

const useRegions = () => {
  const [kecamatans, setKecamatans] = useState<AciKecamatan[]>([]);
  const [kelurahans, setKelurahans] = useState<AciKelurahan[]>([]);
  const [loadingKecamatans, setLoadingKecamatans] = useState(false);
  const [loadingKelurahans, setLoadingKelurahans] = useState(false);

  const fetchKecamatans = useCallback(async () => {
    setLoadingKecamatans(true);
    try {
      const token = getItem<string>('aci_token');
      if (!token) return;
      const res = await getAciKecamatans(token, {
        per_page: 1000,
        wilayah_kabupaten_id: 1212,
      });
      const items = (res as any)?.data?.data || (res as any)?.data || res || [];
      setKecamatans(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKecamatans(false);
    }
  }, []);

  const fetchKelurahans = useCallback(async (kecamatanId: number) => {
    setLoadingKelurahans(true);
    try {
      const token = getItem<string>('aci_token');
      if (!token) return;
      const res = await getAciKelurahans(token, kecamatanId, {
        per_page: 2000,
        search: kecamatanId.toString(),
      });
      const items = (res as any)?.data?.data || (res as any)?.data || res || [];
      setKelurahans(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKelurahans(false);
    }
  }, []);

  useEffect(() => {
    fetchKecamatans();
  }, [fetchKecamatans]);

  return {
    kecamatans,
    kelurahans,
    loadingKecamatans,
    loadingKelurahans,
    fetchKelurahans,
    setKelurahans,
  };
};

const useFetchDetail = (
  id: string | string[],
  setForm: any,
  fetchKelurahans: (kecamatanId: number) => Promise<void>
) => {
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token) return;

      const response = await getAciLaporanDetail(token, id as string);
      const data =
        (response as any).data ||
        ((response as any).id || (response as any).judul ? response : null);

      if (data) {
        if (data.kecamatan_id) {
          await fetchKelurahans(data.kecamatan_id);
        }
        setForm({
          deskripsi: data.deskripsi || '',
          kategoriId:
            data.kategori_laporan_id ||
            data.kategori_id ||
            data.kategori?.id ||
            null,
          alamat: data.alamat || data.lokasi || '',
          kecamatanId: data.kecamatan_id || null,
          kelurahanId: data.kelurahan_id || null,
          latitude: data.latitude ? parseFloat(data.latitude.toString()) : null,
          longitude: data.longitude
            ? parseFloat(data.longitude.toString())
            : null,
          image: null,
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal memuat detail laporan');
    } finally {
      setLoading(false);
    }
  }, [id, fetchKelurahans, setForm]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { loading };
};

const useMediaHandlers = (setForm: any) => {
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Ditolak',
        'Aplikasi membutuhkan izin kamera untuk mengambil foto.'
      );
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!res.canceled && res.assets[0]) {
      const asset = res.assets[0];
      const { uri, fileSize } = await compressImageIfNeeded(asset);
      setForm((p: any) => ({
        ...p,
        image: {
          uri,
          name: asset.fileName || 'camera-capture.jpg',
          type: asset.mimeType || 'image/jpeg',
          fileSize,
        },
      }));
    }
  };

  const handleSelectLocation = async (lat: number, lng: number) => {
    setForm((p: any) => ({ ...p, latitude: lat, longitude: lng }));

    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (results.length > 0) {
        const addr = results[0];
        const formatted = [addr.street, addr.district, addr.city, addr.region]
          .filter(Boolean)
          .join(', ');
        setForm((p: any) => ({ ...p, alamat: formatted }));
      } else {
        setForm((p: any) => ({
          ...p,
          alamat: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
        }));
      }
    } catch (e) {
      console.error('Reverse geocode error:', e);
      setForm((p: any) => ({
        ...p,
        alamat: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
      }));
    }
  };

  return { handlePickImage, handleSelectLocation };
};

const validateEditForm = (form: any) => {
  const { deskripsi, kategoriId, kecamatanId, kelurahanId, alamat, image } =
    form;
  const missingFields = [];
  if (kategoriId === null || kategoriId === undefined)
    missingFields.push('Kategori');
  if (kecamatanId === null || kecamatanId === undefined)
    missingFields.push('Kecamatan');
  if (kelurahanId === null || kelurahanId === undefined)
    missingFields.push('Kelurahan');
  if (!alamat?.trim()) missingFields.push('Alamat');
  if (!deskripsi?.trim()) missingFields.push('Deskripsi');
  if (!image) missingFields.push('Foto Kejadian');
  return missingFields;
};

const useSubmitLaporan = ({
  id,
  form,
  router,
  showAlert,
}: {
  id: string | string[];
  form: any;
  router: any;
  showAlert: (config: any) => void;
}) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const missingFields = validateEditForm(form);
    if (missingFields.length > 0) {
      return showAlert({
        type: 'warning',
        title: 'Peringatan',
        message: `Harap lengkapi field berikut: ${missingFields.join(', ')}.`,
      });
    }

    setSubmitting(true);
    try {
      const token = getItem<string>('aci_token');
      const payload: AciUpdateLaporanPayload = {
        judul: (form.deskripsi || '').substring(0, 50),
        deskripsi: form.deskripsi,
        kategori_laporan_id: form.kategoriId as number,
        kategori_id: form.kategoriId as number,
        alamat: form.alamat,
        lokasi: form.alamat,
        kecamatan_id: form.kecamatanId as number,
        kelurahan_id: form.kelurahanId as number,
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        file_masyarakat: form.image?.uri ? form.image : undefined,
      };

      await updateAciLaporan(token!, id as string, payload);
      showAlert({
        type: 'success',
        title: 'Berhasil',
        message: 'Laporan berhasil diperbarui.',
        onConfirm: () => router.back(),
      });
    } catch (e: any) {
      showAlert({ type: 'error', title: 'Gagal', message: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, handleSubmit };
};

const useEditForm = (fetchKelurahans: any, setKelurahans: any) => {
  const [form, setForm] = useState({
    deskripsi: '',
    kategoriId: null as number | null,
    alamat: '',
    kecamatanId: null as number | null,
    kelurahanId: null as number | null,
    latitude: null as number | null,
    longitude: null as number | null,
    image: null as any,
  });

  const setDeskripsi = (v: string) => setForm((p) => ({ ...p, deskripsi: v }));
  const setKategoriId = (v: number | null) =>
    setForm((p) => ({ ...p, kategoriId: v }));
  const setAlamat = (v: string) => setForm((p) => ({ ...p, alamat: v }));
  const setKecamatanId = (v: number | null) => {
    setForm((p) => ({ ...p, kecamatanId: v, kelurahanId: null }));
    if (v) fetchKelurahans(v);
    else setKelurahans([]);
  };
  const setKelurahanId = (v: number | null) =>
    setForm((p) => ({ ...p, kelurahanId: v }));
  const setImage = (v: any) => setForm((p) => ({ ...p, image: v }));

  return {
    form,
    setForm,
    setDeskripsi,
    setKategoriId,
    setAlamat,
    setKecamatanId,
    setKelurahanId,
    setImage,
  };
};

export const useEditRiwayatLogic = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { alertConfig, showAlert, hideAlert } = useAciAlert();
  const { categories, loadingCategories } = useCategories();
  const {
    kecamatans,
    kelurahans,
    loadingKecamatans,
    loadingKelurahans,
    fetchKelurahans,
    setKelurahans,
  } = useRegions();

  const formUtils = useEditForm(fetchKelurahans, setKelurahans);
  const { form, setForm, ...setters } = formUtils;

  const { loading } = useFetchDetail(id, setForm, fetchKelurahans);
  const { handlePickImage, handleSelectLocation } = useMediaHandlers(setForm);
  const { submitting, handleSubmit } = useSubmitLaporan({
    id,
    form,
    router,
    showAlert,
  });

  useEffect(() => {
    setLocationListener((lat, lng) => handleSelectLocation(lat, lng));
    return () => setLocationListener(null);
  }, [handleSelectLocation]);

  const handleOpenMap = () => {
    const params = new URLSearchParams();
    if (form.latitude) params.append('initialLat', form.latitude.toString());
    if (form.longitude) params.append('initialLng', form.longitude.toString());
    router.push(`/pelayanan-publik/aci/select-location?${params.toString()}`);
  };

  return {
    ...form,
    ...setters,
    loading,
    submitting,
    categories,
    loadingCategories,
    kecamatans,
    kelurahans,
    loadingKecamatans,
    loadingKelurahans,
    handleOpenMap,
    alertConfig,
    hideAlert,
    handleSubmit,
    handlePickImage,
  };
};

export default function Ignored() {
  return null;
}
