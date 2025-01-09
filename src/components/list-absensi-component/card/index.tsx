import { type AbsenMasukDanPulangByUserResponse } from '@/api';
import { Image, Pressable, Text, View } from '@/components/ui';

interface CardProps {
  data: AbsenMasukDanPulangByUserResponse; // menerima objek tunggal
}

export const Card = ({ data }: CardProps) => (
  <View className="my-4 flex-row items-center rounded-lg bg-white p-4 shadow">
    {/* Menampilkan gambar user */}
    <Image
      source={{ uri: data.user.photo || 'https://dummyimage.com/80x80' }}
      className="mr-4 size-16 rounded-full"
    />
    <View className="flex-1">
      {/* Menampilkan nama user */}
      <Text className="text-lg font-bold">{data.user.name}</Text>
      <Text className="text-sm text-gray-600">
        Absen Masuk: {data.waktu_masuk}
      </Text>

      {/* Menampilkan absen pulang */}
      <Text className="mt-2 text-sm text-gray-600">Absen Pulang:</Text>
      {data.absen_pulang.length > 0 ? (
        data.absen_pulang.map((item, index) => (
          <Text key={index} className="text-sm text-gray-600">
            {item.waktu_pulang}
          </Text>
        ))
      ) : (
        <Text className="text-sm text-gray-600">
          - Belum ada absen pulang -
        </Text>
      )}
    </View>
    <Pressable className="p-2">
      <Image
        source={{ uri: 'https://dummyimage.com/40x40/ff0000/ffffff&text=!' }}
        className="size-10 rounded-full"
      />
    </Pressable>
  </View>
);
