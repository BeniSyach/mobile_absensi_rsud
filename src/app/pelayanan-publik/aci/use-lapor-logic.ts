import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  type AciKategori,
  type AciKecamatan,
  type AciKelurahan,
  createAciLaporan,
  getAciKategoris,
  getAciKecamatans,
  getAciKelurahans,
} from './aci-service';
import { useAciAlert } from './hooks/use-aci-alert';
import { setLocationListener } from './location-store';
import { compressImageIfNeeded } from './utils/image-utils';

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

const useKecamatans = () => {
  const [kecamatans, setKecamatans] = useState<AciKecamatan[]>([]);
  const [loadingKecamatans, setLoadingKecamatans] = useState(false);

  const fetchKecamatans = useCallback(async () => {
    setLoadingKecamatans(true);
    try {
      const token = getItem<string>('aci_token');
      if (!token) return;

      const res = await getAciKecamatans(token, {
        per_page: 1000,
        wilayah_kabupaten_id: 1212,
      });
      const allItems = Array.isArray(res) ? res : (res as any).data || [];
      // Client-side filter is now secondary safety, or can be relaxed if API works
      const items = allItems;
      setKecamatans(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKecamatans(false);
    }
  }, []);

  useEffect(() => {
    fetchKecamatans();
  }, [fetchKecamatans]);

  return { kecamatans, loadingKecamatans };
};

const useKelurahans = () => {
  const [kelurahans, setKelurahans] = useState<AciKelurahan[]>([]);
  const [loadingKelurahans, setLoadingKelurahans] = useState(false);

  const fetchKelurahans = useCallback(async (kecamatanId: number) => {
    setLoadingKelurahans(true);
    try {
      const token = getItem<string>('aci_token');
      if (!token) return;
      console.log('fetchKelurahans requesting for ID:', kecamatanId);

      // Use standard endpoint with search param as per user instruction
      const res = await getAciKelurahans(token, kecamatanId, {
        per_page: 2000,
        search: kecamatanId.toString(),
      });

      const allItems = Array.isArray(res) ? res : (res as any).data || [];
      console.log(
        `Fetched ${allItems.length} raw items from /api/wilayah-desa`
      );

      // Client-side filtering as a fallback (still good to have)
      // Client-side filtering as a fallback - Relaxed or Removed to trust API
      const items = allItems; // Trust the API search?

      // If we really want to filter, ensure we don't accidentally hide everything.
      // For now, if API returns results for ?search=ID, we assume they are correct.

      console.log(
        `Using ${items.length} items from API directly without strict filtering`
      );
      if (items.length > 0) {
        console.log('Sample item:', JSON.stringify(items[0], null, 2));
      }

      setKelurahans(Array.isArray(items) ? items : []);

      console.log(`Filtered down to ${items.length} items`);
      if (items.length > 0) {
        console.log('Sample filtered item:', JSON.stringify(items[0], null, 2));
      }

      setKelurahans(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error(e);
      setKelurahans([]);
    } finally {
      setLoadingKelurahans(false);
    }
  }, []);

  return { kelurahans, loadingKelurahans, fetchKelurahans, setKelurahans };
};

const useRegions = () => {
  const { kecamatans, loadingKecamatans } = useKecamatans();
  const { kelurahans, loadingKelurahans, fetchKelurahans, setKelurahans } =
    useKelurahans();

  return {
    kecamatans,
    kelurahans,
    loadingKecamatans,
    loadingKelurahans,
    fetchKelurahans,
    setKelurahans,
  };
};

const initialFormState = {
  deskripsi: '',
  kategoriId: null as number | null,
  alamat: '',
  kecamatanId: null as number | null,
  kelurahanId: null as number | null,
  latitude: null as number | null,
  longitude: null as number | null,
  image: null as any,
};

const MEDIA_CAPTURE_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

const useLaporFormState = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialFormState);
  return { loading, setLoading, form, setForm };
};

const performPreSubmissionChecks = async (form: any, showAlert: any) => {
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 5000);
    await fetch(
      'https://apiaci-deliserdangsehat.deliserdangkab.go.id/api/rekap?status_laporan=0',
      {
        method: 'HEAD',
        signal: ctrl.signal,
      }
    );
    clearTimeout(tid);
  } catch (e) {
    showAlert({
      type: 'error',
      title: 'Koneksi Bermasalah',
      message: 'Gagal menghubungi server. Periksa paket data.',
    });
    return false;
  }

  if (!form.latitude || !form.longitude) {
    showAlert({
      type: 'error',
      title: 'Lokasi Tidak Valid',
      message: 'Koordinat tidak terdeteksi. Ambil foto ulang.',
    });
    return false;
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  if (form.image?.fileSize && form.image.fileSize > MAX_SIZE) {
    showAlert({
      type: 'error',
      title: 'File Terlalu Besar',
      message: 'Ukuran foto melebihi 5MB. Silakan kompres foto.',
    });
    return false;
  }
  return true;
};

const useLaporSubmission = (
  form: typeof initialFormState,
  { setLoading, showAlert, router }: any
) => {
  const handleSubmit = async () => {
    const { deskripsi, kategoriId, kecamatanId, kelurahanId, alamat, image } =
      form;
    if (
      !kategoriId ||
      !kecamatanId ||
      !kelurahanId ||
      !alamat ||
      !deskripsi ||
      !image
    ) {
      return showAlert({
        type: 'warning',
        title: 'Lengkapi Data',
        message: 'Harap lengkapi semua field dan foto.',
      });
    }

    try {
      setLoading(true);
      if (!(await performPreSubmissionChecks(form, showAlert))) return;

      const token = getItem<string>('aci_token');
      await createAciLaporan(token!, {
        judul: (deskripsi || '').substring(0, 50),
        deskripsi,
        kategori_laporan_id: kategoriId as number,
        alamat,
        kecamatan_id: kecamatanId as number,
        kelurahan_id: kelurahanId as number,
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        prioritas: 'sedang',
        file_masyarakat: form.image,
      });

      showAlert({
        type: 'success',
        title: 'Berhasil',
        message: 'Laporan dikirim.',
        onConfirm: () => router.replace('/pelayanan-publik/aci/riwayat'),
      });
    } catch (e: any) {
      showAlert({ type: 'error', title: 'Gagal', message: e.message });
    } finally {
      setLoading(false);
    }
  };
  return { handleSubmit };
};

const useLocationHandler = (setForm: any) => {
  const handleSelectLocation = async (lat: number, lng: number) => {
    setForm((p: any) => ({ ...p, latitude: lat, longitude: lng }));
  };
  return { handleSelectLocation };
};

const useImageHandler = (setForm: any, setLoading: any, showAlert: any) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const requestPermissions = async (type: 'camera') => {
    const { status: camStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (camStatus !== 'granted' || locStatus !== 'granted') {
      showAlert({
        type: 'error',
        title: 'Izin Ditolak',
        message: 'Aplikasi membutuhkan izin Kamera dan Lokasi.',
      });
      return false;
    }
    return true;
  };

  const processAsset = async (asset: any) => {
    setLoading(true);
    try {
      const isVideo = asset.type === 'video';
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { uri, fileSize } = await compressImageIfNeeded(asset);

      setForm((p: any) => ({
        ...p,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        image: {
          uri,
          name: asset.fileName || (isVideo ? 'video.mp4' : 'image.jpg'),
          type: asset.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
          fileSize,
        },
      }));
    } catch (e) {
      showAlert({
        type: 'warning',
        title: 'Gagal Lokasi',
        message: 'Gagal deteksi koordinat.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureImage = async () => {
    if (!(await requestPermissions('camera'))) return;
    const res = await ImagePicker.launchCameraAsync(MEDIA_CAPTURE_OPTIONS);
    if (!res.canceled && res.assets[0]) await processAsset(res.assets[0]);
  };

  const handlePickGallery = async () => {
    // ❌ JANGAN request permission
    const res = await ImagePicker.launchImageLibraryAsync(
      MEDIA_CAPTURE_OPTIONS
    );
    if (!res.canceled && res.assets[0]) await processAsset(res.assets[0]);
  };

  return { handleCaptureImage, handlePickGallery };
};

const useLaporForm = () => {
  const router = useRouter();
  const { alertConfig, showAlert, hideAlert } = useAciAlert();
  const { loading, setLoading, form, setForm } = useLaporFormState();
  const { handleSelectLocation } = useLocationHandler(setForm);
  const { handleSubmit } = useLaporSubmission(form, {
    setLoading,
    showAlert,
    router,
  });
  const { handleCaptureImage, handlePickGallery } = useImageHandler(
    setForm,
    setLoading,
    showAlert
  );

  return {
    form,
    loading,
    handleSubmit,
    handleCaptureImage,
    handlePickGallery,
    handleSelectLocation,
    setForm,
    alertConfig,
    hideAlert,
    showAlert,
  };
};

export const useLaporLogic = () => {
  const { categories, loadingCategories } = useCategories();
  const {
    kecamatans,
    kelurahans,
    loadingKecamatans,
    loadingKelurahans,
    fetchKelurahans,
    setKelurahans,
  } = useRegions();
  const {
    form,
    loading,
    handleSubmit,
    handleCaptureImage,
    handlePickGallery,
    handleSelectLocation,
    setForm,
    alertConfig,
    hideAlert,
  } = useLaporForm();

  useEffect(() => {
    setLocationListener((lat, lng) => handleSelectLocation(lat, lng));
    return () => setLocationListener(null);
  }, [handleSelectLocation]);

  return {
    ...form,
    loading,
    categories,
    loadingCategories,
    kecamatans,
    kelurahans,
    loadingKecamatans,
    loadingKelurahans,
    setDeskripsi: (v: string) => setForm((p) => ({ ...p, deskripsi: v })),
    setKategoriId: (v: number | null) =>
      setForm((p) => ({ ...p, kategoriId: v })),
    setAlamat: (v: string) => setForm((p) => ({ ...p, alamat: v })),
    setKecamatanId: (v: number | null) => {
      setForm((p) => ({ ...p, kecamatanId: v, kelurahanId: null }));
      if (v) fetchKelurahans(v);
      else setKelurahans([]);
    },
    setKelurahanId: (v: number | null) =>
      setForm((p) => ({ ...p, kelurahanId: v })),
    setImage: (v: any) =>
      setForm((p) => ({ ...p, image: v, latitude: null, longitude: null })),
    handleCaptureImage,
    handlePickGallery,
    handleSelectLocation,
    handleSubmit,
    alertConfig,
    hideAlert,
  };
};

export default function Ignored() {
  return null;
}
