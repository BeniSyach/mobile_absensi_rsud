import { router, Stack } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PutUser } from '@/api';
import FormEditUser, {
  type FormEditUserProps,
} from '@/components/edit-user-form/form-edit-user';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function EditUser() {
  const { mutate, isPending, isError } = PutUser({
    onSuccess: () => {
      showMessage({
        message: 'Edit User Berhasil',
        type: 'success',
        duration: 7000,
      });
      router.back();
    },
    onError: () => {
      showErrorMessage('Edit User Gagal');
    },
  });
  const userData = getMessage();

  const onSubmit: FormEditUserProps['onSubmit'] = (data) => {
    if (!userData?.data.nik) return;
    const formData = {
      ...data,
      nik: userData.data.nik.toString(),
      opd_id: userData.data.unit_kerja_id,
    };
    mutate(formData);
  };

  if (!userData) return null;

  return (
    <SafeAreaView
      className="flex-1 bg-[#0B3880]"
      edges={['top', 'left', 'right']}
    >
      <Stack.Screen
        options={{ title: 'Edit User', headerBackTitle: 'edit-user' }}
      />
      <FormEditUser
        onSubmit={onSubmit}
        isPending={isPending}
        isError={isError}
        defaultValues={{
          name: userData.data.nama,
          nip: userData.data.nip.toString(),
          nik: userData.data.nik.toString(),
          id_divisi: userData.data.unit_kerja_id.toString(),
          id_gender: userData.data.jenis_kelamin.toString(),
          id_status:
            userData.data.status_pegawai.nama_status_pegawai.toString(),
        }}
      />
    </SafeAreaView>
  );
}
