import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import {
  type AciPermission,
  type AciUpdateRolePayload,
  getAciPermissions,
  getAciRoleDetail,
  updateAciRole,
} from '../../../aci-service';

type AlertType = 'success' | 'error';

interface AlertConfig {
  show: boolean;
  title: string;
  message: string;
  type: AlertType;
  onConfirm: () => void;
}

interface ShowAlertOptions {
  title: string;
  message: string;
  type: AlertType;
  onConfirm?: () => void;
}

const parseErrorMessage = (error: any): string => {
  let errorMessage = 'Gagal memperbarui role';

  if (error?.response?.data) {
    const errorData = error.response.data;
    if (errorData.errors) {
      const errors = Object.values(errorData.errors).flat();
      errorMessage = errors.join('\n');
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
  }

  return errorMessage;
};

interface SubmitRoleUpdateParams {
  roleId: string;
  formData: AciUpdateRolePayload;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showAlert: (options: ShowAlertOptions) => void;
  hideAlert: () => void;
  router: any;
}

const submitRoleUpdate = async ({
  roleId,
  formData,
  setLoading,
  showAlert,
  hideAlert,
  router,
}: SubmitRoleUpdateParams) => {
  if (!formData.name) {
    showAlert({
      title: 'Validasi Gagal',
      message: 'Mohon isi nama role.',
      type: 'error',
    });
    return;
  }

  if (!formData.permissions || formData.permissions.length === 0) {
    showAlert({
      title: 'Validasi Gagal',
      message: 'Mohon pilih minimal satu permission.',
      type: 'error',
    });
    return;
  }

  try {
    setLoading(true);
    const token = getItem<string>('aci_token');
    if (!token) {
      Alert.alert('Error', 'Sesi kadaluarsa');
      return;
    }

    await updateAciRole(token, roleId, formData);

    showAlert({
      title: 'Sukses',
      message: 'Data role berhasil diperbarui',
      type: 'success',
      onConfirm: () => {
        hideAlert();
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Update role failed', error);
    const errorMessage = parseErrorMessage(error);
    showAlert({ title: 'Error', message: errorMessage, type: 'error' });
  } finally {
    setLoading(false);
  }
};

const initRoleData = async ({
  roleId,
  setFormData,
  setAllPermissions,
  setLoading,
}: {
  roleId: string;
  setFormData: React.Dispatch<React.SetStateAction<AciUpdateRolePayload>>;
  setAllPermissions: React.Dispatch<React.SetStateAction<AciPermission[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const token = getItem<string>('aci_token');
  if (!token) return;

  const [roleRes, permRes] = await Promise.allSettled([
    getAciRoleDetail(token, roleId),
    getAciPermissions(token),
  ]);

  if (roleRes.status === 'fulfilled') {
    const role = roleRes.value.data;
    setFormData({
      name: role.name,
      guard_name: role.guard_name,
      permissions: role.permissions?.map((p: any) => p.id) || [],
    });
  }

  if (permRes.status === 'fulfilled' && permRes.value.status === 200) {
    if (Array.isArray(permRes.value.data)) {
      setAllPermissions(permRes.value.data);
    } else if (
      permRes.value.data &&
      typeof permRes.value.data === 'object' &&
      !Array.isArray(permRes.value.data)
    ) {
      const grouped = permRes.value.data as Record<string, AciPermission[]>;
      const flattened = Object.values(grouped).flat();
      setAllPermissions(flattened);
    } else {
      console.warn('Unexpected permissions format:', permRes.value.data);
    }
  } else if (permRes.status === 'rejected') {
    console.error('Failed to fetch permissions:', permRes.reason);
  }

  setLoading(false);
};

export const useEditRoleLogic = (roleId: string) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allPermissions, setAllPermissions] = useState<AciPermission[]>([]);
  const [formData, setFormData] = useState<AciUpdateRolePayload>({
    name: '',
    guard_name: '',
    permissions: [],
  });
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    show: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: () => {},
  });

  const showAlert = (options: ShowAlertOptions) =>
    setAlertConfig({
      show: true,
      title: options.title,
      message: options.message,
      type: options.type,
      onConfirm:
        options.onConfirm ||
        (() => setAlertConfig((p) => ({ ...p, show: false }))),
    });

  useEffect(() => {
    initRoleData({ roleId, setFormData, setAllPermissions, setLoading });
  }, [roleId]);

  const updateFormField = (
    field: keyof AciUpdateRolePayload,
    value: string | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () =>
    submitRoleUpdate({
      roleId,
      formData,
      setLoading,
      showAlert,
      router,
      hideAlert: () => setAlertConfig((p) => ({ ...p, show: false })),
    });

  return {
    loading,
    formData,
    allPermissions,
    alertConfig,
    updateFormField,
    handleSubmit,
  };
};

export default function Ignored() {
  return null;
}
