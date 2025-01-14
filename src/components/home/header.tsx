import { Env } from '@env';
import { Link } from 'expo-router';

import { type GetUserDetailResponse } from '@/api';
import { Image, Text, View } from '@/components/ui';

export default function Header({ data }: { data: GetUserDetailResponse }) {
  return (
    <Link href="/settings">
      <View className="mb-4 flex-row items-center rounded-lg bg-white p-4 shadow">
        <Image
          source={{
            uri: data?.photo
              ? `${Env.API_URL}/storage/${data.photo}`
              : `https://dummyimage.com/80x80`, // fallback URL jika data?.photo tidak ada
          }}
          className="mr-4 size-20 rounded-full"
        />
        <View className="flex-1">
          <Text className="dark:text-dark-500 text-lg font-bold">
            {data?.name && data.name.length > 20
              ? `${data.name.slice(0, 20)}...`
              : data?.name}
          </Text>
          <Text className="dark:text-dark-500 font-semibold text-gray-600">
            {data?.email && data.email.length > 20
              ? `${data.email.slice(0, 20)}...`
              : data?.email}
          </Text>
          <Text className="dark:text-dark-500 font-semibold text-gray-600">
            {data?.nomor_hp && data.nomor_hp.length > 15
              ? `${data.nomor_hp.slice(0, 15)}...`
              : data?.nomor_hp}
          </Text>
        </View>
        {/* <Pressable className="p-2">
        <Image
          source={{ uri: 'https://dummyimage.com/40x40/ff0000/ffffff&text=!' }}
          className="size-10 rounded-full"
        />
        </Pressable> */}
      </View>
    </Link>
  );
}
