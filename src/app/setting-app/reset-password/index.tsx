import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { ResetPasswordUser } from '@/api';
import FormEditPassword, {
  type FormEditPasswordProps,
} from '@/components/edit-password-user/form-edit-password';
import { SafeAreaView, showErrorMessage } from '@/components/ui';

export default function ResetPassword() {
  const router = useRouter();
  const { mutate, isPending } = ResetPasswordUser({
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
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: 'Reset Password',
          headerBackTitle: 'reset-password',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/background/background_absensi.png')}
        resizeMode="cover"
        className="flex-1 px-4"
      >
        <FormEditPassword onSubmit={onSubmit} isPending={isPending} />
      </ImageBackground>
    </SafeAreaView>
  );
}
