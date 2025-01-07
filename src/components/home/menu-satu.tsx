import { Link } from 'expo-router';

import { Image, Pressable, Text, View } from '@/components/ui';

export default function MenuSatu() {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Link href="/feed/add-post" asChild>
        <Pressable>
          <View className="items-center rounded-lg bg-white p-4 shadow">
            <Image
              source={{ uri: 'https://dummyimage.com/100x100' }}
              className="size-44 rounded-lg"
            />
            <Text className="mt-2 text-center text-lg font-bold">Absensi</Text>
          </View>
        </Pressable>
      </Link>
      <Link href="/feed/add-post" asChild>
        <Pressable>
          <View className="items-center rounded-lg bg-white p-4 shadow">
            <Image
              source={{ uri: 'https://dummyimage.com/100x100' }}
              className="size-44 rounded-lg"
            />
            <Text className="mt-2 text-center text-lg font-bold">SPT</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}
