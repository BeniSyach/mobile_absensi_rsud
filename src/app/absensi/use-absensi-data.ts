import { useStatusAbsenUser } from '@/api/absensi/cek-status-absen-user';
import { useGetUser } from '@/api/users/get-users';
import { getMessage } from '@/lib';

export default function useAbsensiData() {
  const storedMessage = getMessage();

  const {
    data: userStatus,
    isLoading: statusUserLoading,
    isError: statusUserError,
  } = useStatusAbsenUser({
    variables: {
      nik: storedMessage?.nik ?? '',
      shift_id: storedMessage?.shift_absen_id ?? 0,
    },
  });

  const {
    data: user,
    isLoading: userLoading,
    isError: isErrorUser,
  } = useGetUser(storedMessage?.nik ?? '');

  return {
    user,
    isError: isErrorUser || statusUserError,
    isLoading: userLoading && statusUserLoading,
    userStatus,
  };
}
