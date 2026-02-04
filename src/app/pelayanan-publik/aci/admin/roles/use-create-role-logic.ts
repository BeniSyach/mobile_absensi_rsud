import { useRouter } from 'expo-router';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import {
  type AciCreateRolePayload,
  type AciPermission,
  createAciRole,
  getAciPermissions,
} from '../../aci-service';

interface AlertConfig {
  show: boolean;
  title: string;
  message: string;
  type: 'success' | 'error';
  onConfirm: () => void;
}

const parseErrorMessage = (error: any): string => {
  let errorMessage = 'Gagal menambahkan role';

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

const createAlertHelpers = (
  setAlertConfig: React.Dispatch<React.SetStateAction<AlertConfig>>,
  router: any
) => {
  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, show: false }));
  };

  const showValidationError = () => {
    setAlertConfig((prev) => ({
      ...prev,
      show: true,
      title: 'Validasi Gagal',
      message: 'Mohon isi nama role.',
      type: 'error',
    }));
  };

  const showPermissionValidationError = () => {
    setAlertConfig((prev) => ({
      ...prev,
      show: true,
      title: 'Validasi Gagal',
      message: 'Mohon pilih minimal satu permission.',
      type: 'error',
    }));
  };

  const showSuccessAlert = () => {
    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'Role berhasil ditambahkan',
      type: 'success',
      onConfirm: () => {
        hideAlert();
        router.back();
      },
    });
  };

  const showErrorAlert = (errorMessage: string) => {
    setAlertConfig({
      show: true,
      title: 'Error',
      message: errorMessage,
      type: 'error',
      onConfirm: hideAlert,
    });
  };

  return {
    showValidationError,
    showPermissionValidationError,
    showSuccessAlert,
    showErrorAlert,
  };
};

const useFetchPermissions = () => {
  const [allPermissions, setAllPermissions] = useState<AciPermission[]>([]);

  useEffect(() => {
    const init = async () => {
      const token = getItem<string>('aci_token');
      if (!token) return;
      const res = await getAciPermissions(token).catch((err) => {
        console.error('Error fetching permissions:', err);
        return null;
      });
      console.log('Permissions API Response:', JSON.stringify(res, null, 2));

      if (res?.status === 200 && Array.isArray(res.data)) {
        setAllPermissions(res.data);
      } else if (
        res?.status === 200 &&
        res.data &&
        typeof res.data === 'object' &&
        !Array.isArray(res.data)
      ) {
        // Flatten grouped permissions object
        const groupedPermissions = res.data as Record<string, AciPermission[]>;
        const flattenedPermissions = Object.values(groupedPermissions).flat();
        setAllPermissions(flattenedPermissions);
      } else {
        // console.warn('Unexpected permissions data format:', res);
      }
    };
    init();
  }, []);

  return allPermissions;
};

export const useCreateRoleLogic = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AciCreateRolePayload>({
    name: '',
    guard_name: 'web',
    permissions: [],
  });

  const allPermissions = useFetchPermissions();

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    show: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: () => {},
  });

  const {
    showValidationError,
    showPermissionValidationError,
    showSuccessAlert,
    showErrorAlert,
  } = createAlertHelpers(setAlertConfig, router);

  const handleSubmit = async () => {
    if (!formData.name) return showValidationError();
    if (!formData.permissions?.length) return showPermissionValidationError();

    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token) return Alert.alert('Error', 'Sesi kadaluarsa');

      await createAciRole(token, formData);
      showSuccessAlert();
    } catch (error: any) {
      showErrorAlert(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    formData,
    setFormData,
    allPermissions,
    alertConfig,
    handleSubmit,
  };
};

export default function Ignored() {
  return null;
}
