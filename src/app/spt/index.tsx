import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';

import { PostSPT } from '@/api/spt/post-spt';
import SptForm, { type SptFormProps } from '@/components/spt/spt-form';
import { showErrorMessage, View } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function Spt() {
  const router = useRouter();
  const { mutate, isPending, isError } = PostSPT();

  const onSubmit: SptFormProps['onSubmit'] = (data) => {
    const userData = getMessage();
    const formData = {
      ...data,
      id_user: userData?.id,
      lama_acara: Number(data.lama_acara),
      file_spt: data.file_spt,
      name: data.file_spt.name,
      mimeType: data.file_spt.mimeType,
    };

    mutate(formData, {
      onSuccess: () => {
        showMessage({
          message: 'SPT berhasil dikirim',
          type: 'success',
          duration: 7000,
        });
        router.back(); // Go back to the previous screen
      },
      onError: (error) => {
        console.error('Error submitting SPT:', error);
        showErrorMessage('Terjadi kesalahan saat mengirim SPT');
      },
    });
  };
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Surat Perintah Tugas',
          headerBackTitle: 'spt',
        }}
      />

      <SptForm onSubmit={onSubmit} isPending={isPending} isError={isError} />
    </View>
  );
}
