import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getItem, removeItem, setItem } from '@/lib/storage';

import {
  type AciDashboardResponse,
  aciLogout,
  type AciUser,
  getAciDashboardMasyarakat,
  getAciProfile,
} from './aci-service';
import { useAciAlert } from './hooks/use-aci-alert';
import { useBackExit } from './hooks/use-back-exit';

const handleLogoutAction = (router: any, showAlert: any) => {
  showAlert({
    type: 'confirm',
    title: 'Keluar',
    message: 'Apakah Anda yakin ingin keluar?',
    confirmText: 'Ya, Keluar',
    cancelText: 'Batal',
    onConfirm: async () => {
      try {
        const token = getItem<string>('aci_token');
        if (token) await aciLogout(token);
        await removeItem('aci_token');
        await removeItem('aci_user');
        router.replace('/pelayanan-publik/aci');
      } catch (e) {
        console.error(e);
      }
    },
  });
};

const useAdminRedirect = (user: AciUser | null, router: any) => {
  useEffect(() => {
    if (user) {
      const userRoles = user.roles?.map((r) => r.name.toUpperCase()) || [];
      const isAdminRole = userRoles.some(
        (role) => role !== 'MASYARAKAT' && role !== ''
      );
      if (isAdminRole) {
        console.log('Admin detected, redirecting to /admin/dashboard');
        router.replace('/pelayanan-publik/aci/admin/dashboard');
      }
    }
  }, [user, router]);
};

export const useDashboardLogic = () => {
  const router = useRouter();
  const [user, setUser] = useState<AciUser | null>(null);
  const [stats, setStats] = useState<AciDashboardResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterDays, setFilterDays] = useState(10);
  const { alertConfig, hideAlert, showAlert } = useAciAlert();

  useBackExit(false);
  useAdminRedirect(user, router);

  const fetchData = useCallback(async () => {
    try {
      const token = getItem<string>('aci_token');
      if (!token) return;

      const profileData = await getAciProfile(token);
      const userData = profileData?.user || profileData?.data || profileData;
      if (userData) {
        setUser(userData);
        setItem('aci_user', userData);

        // Avoid fetching masyarakat dashboard if user is an admin/UPT/SDA
        const userRoles =
          userData.roles?.map((r: any) => r.name.toUpperCase()) || [];
        const isAdminRole = userRoles.some(
          (role: string) => role !== 'MASYARAKAT' && role !== ''
        );
        if (isAdminRole) return;
      }

      const dashboardData = await getAciDashboardMasyarakat(token, {
        days: filterDays,
      });
      if (dashboardData) setStats(dashboardData);
    } catch (e: any) {
      console.error('Fetch dashboard data failed', e);
    }
  }, [filterDays]);

  useEffect(() => {
    const storedUser = getItem<AciUser>('aci_user');
    if (storedUser) setUser(storedUser);
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return {
    user,
    stats,
    refreshing,
    onRefresh,
    handleLogout: () => handleLogoutAction(router, showAlert),
    router,
    filterDays,
    setFilterDays,
    alertConfig,
    hideAlert,
  };
};

export default function Ignored() {
  return null;
}
