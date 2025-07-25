import { Search } from 'lucide-react-native';
import { TextInput } from 'react-native';

import { View } from '@/components/ui';

export default function FormHasilKerja() {
  return (
    <View className="m-5 mt-7">
      {/* Baris 1 */}
      <View className="mb-2 flex-row items-center rounded-lg border bg-[#D8D8D8] p-2">
        <Search className="mr-2 size-6" color="black" strokeWidth={2.5} />
        <TextInput
          className="flex-1 bg-[#D8D8D8] py-2"
          placeholder="Cari Indikator"
        />
      </View>
    </View>
  );
}
