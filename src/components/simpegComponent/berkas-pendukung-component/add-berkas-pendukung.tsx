import { View } from '@/components/ui';
import { ButtonSecondary } from '@/components/ui/button-secondary';

import FormBerkasPendukung from './form-berkas-pendukung';

export default function AddBerkasPendukung() {
  return (
    <View className=" mx-5 mt-4 flex-row justify-start">
      <ButtonSecondary
        label="Tambah Data"
        renderForm={() => <FormBerkasPendukung />}
      />
    </View>
  );
}
