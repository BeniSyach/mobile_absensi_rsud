import { Pencil, Trash } from 'lucide-react-native';

import { type PendidikanResponse } from '@/api/simpeg/pendidikan';
import { Text, TouchableOpacity, View } from '@/components/ui';

interface Props {
  data: PendidikanResponse['data']['data'][number];
}

export default function CardPendidikanComp({ data }: Props) {
  return (
    <View className="my-2 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-md">
      <Text className="text-lg font-semibold">{data.tgl_lulus}</Text>
      <Text className="text-lg font-semibold">{data.tingkat_pendidikan}</Text>
      <View className="flex-row gap-4">
        <TouchableOpacity className="mx-2 rounded-lg bg-blue-500 p-2">
          <Pencil size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="mx-2 rounded-lg p-2"
          style={{ backgroundColor: 'red' }}
        >
          <Trash size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
