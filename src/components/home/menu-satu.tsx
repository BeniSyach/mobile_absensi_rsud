import { Link } from 'expo-router';

import { Image, Pressable, Text, View } from '@/components/ui';

export default function MenuSatu() {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Link href="/absensi" asChild>
        <Pressable>
          <View className="items-center rounded-lg bg-white p-4 shadow">
            <Image
              source={require('../../../assets/absen.png')}
              className="size-44 rounded-lg"
            />
            <Text className="dark:text-dark-500 mt-2 text-center text-lg font-bold">
              Absensi
            </Text>
          </View>
        </Pressable>
      </Link>
      <Link href="/spt" asChild>
        <Pressable>
          <View className="items-center rounded-lg bg-white p-4 shadow">
            <Image
              source={require('../../../assets/sptupload.png')}
              className="size-44 rounded-lg"
            />
            <Text className="dark:text-dark-500 mt-2 text-center text-lg font-bold">
              SPT
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}
