import { type GetAllSPTResponse } from '@/api';
import { Image, Pressable, Text, View } from '@/components/ui';

interface CardProps {
  data: GetAllSPTResponse; // menerima objek tunggal SPT
}

export const CardSPT = ({ data }: CardProps) => (
  <View className="my-4 flex-row items-center rounded-lg bg-white p-4 shadow">
    {/* Menampilkan gambar user */}
    <Image
      source={{ uri: data.user.photo || 'https://dummyimage.com/80x80' }}
      className="mr-4 size-16 rounded-full"
    />
    <View className="flex-1">
      {/* Menampilkan nama user */}
      <Text className="text-lg font-bold">{data.user.name}</Text>

      {/* Menampilkan tanggal dan waktu SPT */}
      <Text className="text-sm text-gray-600">
        Tanggal SPT: {data.tanggal_spt}
      </Text>
      <Text className="text-sm text-gray-600">Waktu SPT: {data.waktu_spt}</Text>

      {/* Menampilkan lama acara dan lokasi */}
      <Text className="mt-2 text-sm text-gray-600">
        Lama Acara: {data.lama_acara} jam
      </Text>
      <Text className="text-sm text-gray-600">Lokasi: {data.lokasi_spt}</Text>
    </View>
    <Pressable className="p-2">
      <Image
        source={{ uri: 'https://dummyimage.com/40x40/ff0000/ffffff&text=!' }}
        className="size-10 rounded-full"
      />
    </Pressable>
  </View>
);
