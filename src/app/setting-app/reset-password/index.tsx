import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';

import { ResetPasswordUser } from '@/api';
import FormEditPassword, {
  type FormEditPasswordProps,
} from '@/components/edit-password-user/form-edit-password';
import { showErrorMessage } from '@/components/ui';

export default function ResetPassword() {
  const router = useRouter();
  const { mutate, isPending, isError } = ResetPasswordUser({
    onSuccess: () => {
      showMessage({
        message: 'Password berhasil direset',
        type: 'success',
        duration: 7000,
      });
      router.back();
    },
    onError: () => {
      showErrorMessage('Password gagal direset');
    },
  });
  const onSubmit: FormEditPasswordProps['onSubmit'] = (data) => {
    mutate(data);
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Reset Password',
          headerBackTitle: 'reset-password',
        }}
      />
      <FormEditPassword
        onSubmit={onSubmit}
        isPending={isPending}
        isError={isError}
      />
    </>
  );
}
