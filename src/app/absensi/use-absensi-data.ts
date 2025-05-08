import { GetUser } from '@/api';
import { GetStatusAbsenUser } from '@/api/absensi/cek-status-absen-user';

export default function useAbsensiData() {
  const { data: userStatus, isLoading: statusUserLoading } =
    GetStatusAbsenUser();

  const { data: user, isLoading: userLoading, isError } = GetUser();

  return {
    user,
    isError,
    isLoading: userLoading && statusUserLoading,
    userStatus,
  };
}
