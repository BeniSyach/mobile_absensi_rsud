import { Stack } from 'expo-router';
import { showMessage } from 'react-native-flash-message';

import { PostSPT } from '@/api/spt/post-spt';
import SptForm, { type SptFormProps } from '@/components/spt/spt-form';
import { showErrorMessage, View } from '@/components/ui';

export default function Spt() {
  const { mutate, isPending, isError } = PostSPT();

  const onSubmit: SptFormProps['onSubmit'] = (data) => {
    console.log(data);

    mutate(data, {
      onSuccess: () => {
        showMessage({
          message: 'SPT berhasil dikirim',
          type: 'success',
        });
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
