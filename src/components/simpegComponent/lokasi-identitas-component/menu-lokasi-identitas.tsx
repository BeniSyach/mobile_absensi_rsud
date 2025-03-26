import { Env } from '@env';

import { type ApiResponse } from '@/api';
import { Image, Text, View } from '@/components/ui';

export default function MenuLokasiIdentitas({ data }: { data: ApiResponse }) {
  return (
    <View className="flex-columns items-center justify-center rounded-lg p-2">
      <Image
        source={{
          uri: data?.data?.photo
            ? `${Env.API_URL}/storage/${data.data.photo}`
            : `https://dummyimage.com/80x80`, // fallback URL jika data?.photo tidak ada
        }}
        className="mr-4 size-36 rounded-full"
        transition={1000}
        contentFit="contain"
      />
      <Text className="text-xl font-bold text-[#0B3880]">
        {data?.data.nama}
      </Text>
      <Text className="text-dark-500 text-sm font-semibold">
        {data?.data.nip}
      </Text>
    </View>
  );
}
