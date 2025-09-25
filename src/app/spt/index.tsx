/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { ImageBackground, SafeAreaView } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { queryClient } from '@/api';
import { PostSPT } from '@/api/spt/post-spt';
import SptForm, { type SptFormProps } from '@/components/spt/spt-form';
import { Title } from '@/components/title';
import { showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function Spt() {
  const router = useRouter();
  const { mutateAsync, isPending, isError } = PostSPT();

  const onSubmit: SptFormProps['onSubmit'] = async (data) => {
    console.log('data SPT', data);
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

    try {
      await mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ['getAllSPTByUser'] });
      showMessage({
        message: 'SPT berhasil dikirim',
        type: 'success',
        duration: 7000,
      });

      router.back(); // kembali ke halaman sebelumnya
    } catch (error: any) {
      console.error('Error submitting SPT:', error);

      let errorMessage = 'Terjadi kesalahan saat mengirim SPT';

      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 413) {
          errorMessage = 'Ukuran data terlalu besar (Request Entity Too Large)';
        } else if (status === 422) {
          errorMessage =
            'Data tidak valid. Silakan periksa kembali input Anda.';
        } else if (status === 500) {
          errorMessage =
            'Terjadi kesalahan server. Silakan coba beberapa saat lagi.';
        }

        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.messages) {
          errorMessage = data.messages;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showErrorMessage(errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1">
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
