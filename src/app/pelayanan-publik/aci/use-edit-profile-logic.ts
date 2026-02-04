import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { getItem, setItem } from '@/lib/storage';

import {
  type AciUser,
  getAciProfile,
  normalizeAciPhoneNumber,
  updateAciProfile,
} from './aci-service';
import { useAciAlert } from './hooks/use-aci-alert';

type ProfileFormData = {
  name: string;
  email: string;
  no_wa: string;
};

const loadProfile = async (setFormData: (data: ProfileFormData) => void) => {
  try {
    const storedUser = getItem<AciUser>('aci_user');
    if (storedUser) {
      setFormData({
        name: storedUser.name || '',
        email: storedUser.email || '',
        no_wa: storedUser.no_wa || '',
      });
    }

    // Refresh data from API to be sure
    const token = getItem<string>('aci_token');
    if (token) {
      const data = await getAciProfile(token);
      const user = data?.user || data?.data || data;
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          no_wa: user.no_wa || '',
        });
        // Update local storage while we are at it
        setItem('aci_user', user);
      }
    }
  } catch (error) {
    console.error('Failed to load profile for editing', error);
  }
};

const updateLocalStorage = (formData: ProfileFormData, no_wa: string) => {
  const storedUser = getItem<AciUser>('aci_user');
  if (storedUser) {
    setItem('aci_user', {
      ...storedUser,
      name: formData.name,
      email: formData.email,
      no_wa,
    });
  }
};

const saveProfile = async (
  formData: ProfileFormData,
  { setLoading, router, showAlert }: any
) => {
  if (!formData.name) {
    showAlert({
      type: 'error',
      title: 'Error',
      message: 'Nama Lengkap tidak boleh kosong',
    });
    return;
  }

  setLoading(true);
  try {
    const token = getItem<string>('aci_token');
    if (!token) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Sesi habis, silakan login kembali',
      });
      return;
    }

    const normalizedPhone = normalizeAciPhoneNumber(formData.no_wa);

    await updateAciProfile(token, {
      name: formData.name,
      email: formData.email,
      no_wa: normalizedPhone,
    });

    updateLocalStorage(formData, normalizedPhone);

    showAlert({
      type: 'success',
      title: 'Sukses',
      message: 'Profil berhasil diperbarui',
      onConfirm: () => router.back(),
    });
  } catch (error: any) {
    console.error('Update profile failed', error);
    let errorMessage =
      error?.response?.data?.message || 'Gagal memperbarui profil';

    if (error?.response?.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors)
        .flat()
        .join('\n');
      if (validationErrors) {
        errorMessage = validationErrors;
      }
    }

    showAlert({
      type: 'error',
      title: 'Gagal',
      message: errorMessage,
    });
  } finally {
    setLoading(false);
  }
};

export const useEditProfileLogic = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { alertConfig, showAlert, hideAlert } = useAciAlert();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    no_wa: '',
  });

  useEffect(() => {
    loadProfile(setFormData);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await saveProfile(formData, { setLoading, router, showAlert });
  };

  return {
    loading,
    formData,
    handleChange,
    handleSave,
    alertConfig,
    hideAlert,
  };
};

export default function Ignored() {
  return null;
}
