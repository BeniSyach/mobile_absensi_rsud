import { View } from '@/components/ui';
import { ButtonSecondary } from '@/components/ui/button-secondary';

import FormBerkasPak from './form-berkas-pak';

export default function AddBerkasPak() {
  return (
    <View className=" mx-5 mt-4 flex-row justify-start">
      <ButtonSecondary
        label="Tambah Data"
        renderForm={() => <FormBerkasPak />}
      />
    </View>
  );
}
