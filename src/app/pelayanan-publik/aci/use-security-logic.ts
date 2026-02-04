import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import {
  type AciSecurityPayload,
  type AciUser,
  updateAciSecurity,
} from './aci-service';

interface FormState {
  email: string;
  currentPass: string;
  newPass: string;
  confirmPass: string;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
}

const validate = (form: FormState) => {
  if (!form.email) {
    Alert.alert('Error', 'Email tidak boleh kosong');
    return false;
  }
  if (form.newPass && form.newPass !== form.confirmPass) {
    Alert.alert('Error', 'Konfirmasi password baru tidak cocok');
    return false;
  }
  if ((form.newPass || form.currentPass) && !form.currentPass) {
    Alert.alert(
      'Error',
      'Silakan masukkan password saat ini untuk mengubah password'
    );
    return false;
  }
  return true;
};

export const useSecurityLogic = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: '',
    currentPass: '',
    newPass: '',
    confirmPass: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  useEffect(() => {
    const storedUser = getItem<AciUser>('aci_user');
    if (storedUser?.email) {
      setForm((prev) => ({ ...prev, email: storedUser.email }));
    }
  }, []);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!validate(form)) return;

    setLoading(true);
    try {
      const token = getItem<string>('aci_token');
      if (!token) {
        Alert.alert('Error', 'Sesi habis, silakan login kembali');
        return;
      }

      const payload: AciSecurityPayload = {
        email: form.email,
        current_password: form.currentPass,
        new_password: form.newPass,
        new_confirm_password: form.confirmPass,
      };

      if (!payload.new_password) delete payload.new_password;
      if (!payload.new_confirm_password) delete payload.new_confirm_password;
      if (!payload.current_password) delete payload.current_password;

      await updateAciSecurity(token, payload);
      Alert.alert('Sukses', 'Profil keamanan berhasil diperbarui', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Update security failed', error);
      Alert.alert(
        'Gagal',
        error?.response?.data?.message || 'Gagal memperbarui keamanan akun'
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleUpdate };
};

export default function Ignored() {
  return null;
}
