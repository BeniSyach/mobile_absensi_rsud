/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { queryClient } from '@/api';
import { PostSPT } from '@/api/spt/post-spt';
import SptForm, { type SptFormProps } from '@/components/spt/spt-form';
import { Title } from '@/components/title';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function Spt() {
  const router = useRouter();
  const { mutateAsync, isPending, isError } = PostSPT({
    onSuccess: (res) => {
      showMessage({
        message: res.message,
        type: 'success',
        duration: 7000,
      });
      router.back();
    },
    onError: (e) => {
      showErrorMessage(e.message);
    },
  });

  const onSubmit: SptFormProps['onSubmit'] = async (data) => {
    const userData = getMessage();

    const formData = {
      ...data,
      opd_id: userData?.kode_unit_kerja,
      id_user: userData?.nik,
      lama_acara: Number(data.lama_acara),
      file_spt: data.file_spt,
      name: data.file_spt.name,
      mimeType: data.file_spt.mimeType,
    };

    await mutateAsync(formData);
    queryClient.invalidateQueries({ queryKey: ['getAllSPTByUser'] });
  };

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Surat Perintah Tugas',
          headerBackTitle: 'spt',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <Title text="Upload Surat Perintah Tugas" />
        <SptForm onSubmit={onSubmit} isPending={isPending} isError={isError} />
      </ImageBackground>
    </SafeAreaView>
  );
}
