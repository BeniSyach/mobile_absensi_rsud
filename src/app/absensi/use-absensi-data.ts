import { GetUser } from '@/api';
import { GetStatusAbsenUser } from '@/api/absensi/cek-status-absen-user';

export default function useAbsensiData() {
  const {
    data: userStatus,
    isLoading: statusUserLoading,
    isError: statusUserError,
    refetch: getStatusDataAbsenUser,
  } = GetStatusAbsenUser();

  const {
    data: user,
    isLoading: userLoading,
    isError: isErrorUser,
  } = GetUser();

  return {
    user,
    isError: isErrorUser || statusUserError,
    isLoading: userLoading && statusUserLoading,
    userStatus,
    getStatusDataAbsenUser,
  };
}
