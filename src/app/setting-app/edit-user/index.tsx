import { router, Stack } from 'expo-router';
import { showMessage } from 'react-native-flash-message';

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
      });
      router.back();
    },
    onError: () => {
      showErrorMessage('Edit User Gagal');
    },
  });
  const userData = getMessage();

  const onSubmit: FormEditUserProps['onSubmit'] = (data) => {
    if (!userData?.id) return;
    const formData = {
      ...data,
      id: userData.id,
    };
    mutate(formData);
  };

  if (!userData) return null;

  return (
    <>
      <Stack.Screen
        options={{ title: 'Edit User', headerBackTitle: 'edit-user' }}
      />
      <FormEditUser
        onSubmit={onSubmit}
        isPending={isPending}
        isError={isError}
        defaultValues={{
          name: userData.name,
          email: userData.email,
          nik: userData.nik,
          id_divisi: userData.id_divisi.toString(),
          id_gender: userData.id_gender.toString(),
          id_status: userData.id_status.toString(),
        }}
      />
    </>
  );
}
