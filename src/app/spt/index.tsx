/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';

import { PostSPT } from '@/api/spt/post-spt';
import SptForm, { type SptFormProps } from '@/components/spt/spt-form';
import { SafeAreaView, showErrorMessage } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function Spt() {
  const router = useRouter();
  const { mutateAsync, isPending, isError } = PostSPT();

  const onSubmit: SptFormProps['onSubmit'] = async (data) => {
    const userData = getMessage();

    const formData = {
      ...data,
      opd_id: userData?.data.unit_kerja.kode_unit_kerja,
      id_user: userData?.data.nik,
      lama_acara: Number(data.lama_acara),
      file_spt: data.file_spt,
      name: data.file_spt.name,
      mimeType: data.file_spt.mimeType,
    };

    try {
      await mutateAsync(formData);

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
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <Stack.Screen
        options={{
          title: 'Surat Perintah Tugas',
          headerBackTitle: 'spt',
        }}
      />

      <SptForm onSubmit={onSubmit} isPending={isPending} isError={isError} />
    </SafeAreaView>
  );
}
