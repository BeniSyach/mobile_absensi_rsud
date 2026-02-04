import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getItem, removeItem } from '@/lib/storage';

import { type AciDashboardResponse, getAciDashboard } from '../aci-service';
import { useAciAlert } from '../hooks/use-aci-alert';
import { useBackExit } from '../hooks/use-back-exit';

export const useAdminDashboardLogic = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AciDashboardResponse | null>(null);
  const [user, setUser] = useState<any>(null);
  const { alertConfig, showAlert, hideAlert } = useAciAlert();

  useBackExit(true, showAlert);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token) return;

      const storedUser = getItem<any>('aci_user');
      setUser(storedUser);

      const response = await getAciDashboard(token);

      setStats(response);
    } catch (error) {
      console.error('Fetch admin dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = useCallback(() => {
    showAlert({
      type: 'confirm',
      title: 'Keluar',
      message: 'Apakah Anda yakin ingin keluar?',
      confirmText: 'Ya, Keluar',
      cancelText: 'Batal',
      onConfirm: async () => {
        try {
          await removeItem('aci_token');

          await removeItem('aci_user');
          router.replace('/pelayanan-publik/aci');
        } catch (e) {
          console.error(e);
        }
      },
    });
  }, [router, showAlert]);

  return {
    loading,
    stats,
    user,
    refetch: fetchDashboardData,
    handleLogout,
    alertConfig,
    hideAlert,
  };
};

export default function Ignored() {
  return null;
}
