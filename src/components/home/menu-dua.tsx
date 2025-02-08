import { Link } from 'expo-router';

import { Image, Pressable, Text, View } from '@/components/ui';

export default function MenuDua() {
  return (
    <View className="flex-row items-center justify-between">
      <Link href="/list-absensi" asChild>
        <Pressable>
          <View className="items-center rounded-lg bg-white p-4 shadow">
            <Image
              source={require('../../../assets/listabsen.png')}
              className="size-44 rounded-lg"
              transition={1000}
            />
            <Text className="dark:text-dark-500 mt-2 text-center text-lg font-bold">
              List Absensi
            </Text>
          </View>
        </Pressable>
      </Link>
      <Link href="/list-spt" asChild>
        <Pressable>
          <View className="items-center rounded-lg bg-white p-4 shadow">
            <Image
              source={require('../../../assets/daftarspt.png')}
              className="size-44 rounded-lg"
              transition={1000}
            />
            <Text className="dark:text-dark-500 mt-2 text-center text-lg font-bold">
              List SPT
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}
