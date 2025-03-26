import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { PostSPT } from '@/api';
import { showErrorMessage } from '@/components/ui';
import { ButtonSecondary } from '@/components/ui/button-secondary';
import { getMessage } from '@/lib';

import {
  type DiklatStrukturalFormProps,
  FormDiklatStruktural,
} from './form-diklat-struktural';

export default function AddDiklatStruktural() {
  const router = useRouter();
  const { mutate, isPending, isError } = PostSPT();
  const onSubmit: DiklatStrukturalFormProps['onSubmit'] = (data) => {
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
    <View className=" mx-5 mt-4 flex-row justify-start">
      <ButtonSecondary
        label="Tambah Data"
        renderForm={() => (
          <FormDiklatStruktural
            onSubmit={onSubmit}
            isPending={isPending}
            isError={isError}
          />
        )}
      />
    </View>
  );
}
