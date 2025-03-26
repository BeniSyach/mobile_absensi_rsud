import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { GetUser } from '@/api';
import { GetStatusAbsenUser } from '@/api/absensi/cek-status-absen-user';

export default function useAbsensiData() {
  const {
    data: userStatus,
    isLoading: statusUserLoading,
    refetch: refetchUserStatus,
  } = GetStatusAbsenUser();

  const {
    data: user,
    isLoading: userLoading,
    isError,
    refetch: refetchUser,
  } = GetUser();

  useFocusEffect(
    useCallback(() => {
      Promise.all([refetchUser(), refetchUserStatus()]).catch((error) =>
        console.error('Error fetching absensi data:', error)
      );
    }, [refetchUser, refetchUserStatus]) // Tambahkan dependensi agar efek berjalan setiap kali layar fokus kembali
  );

  return {
    user,
    isError,
    isLoading: userLoading || statusUserLoading,
    userStatus,
  };
}
