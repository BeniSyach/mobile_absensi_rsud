import { Link } from 'expo-router';

import { Image, Pressable, Text, View } from '@/components/ui';

import { Title } from '../title';

export default function MenuKegiatanHarianSaya() {
  return (
    <View className="bg-whites m-2 rounded-2xl bg-white">
      <Title text="Kegiatan Harian Saya" className="bg-[#0B3880]" />
      <View className="flex-row items-center justify-between p-2">
        <Link href="/ekin" asChild>
          <Pressable>
            <Image
              source={require('../../../assets/image/pending.png')}
              className="size-28"
              transition={1000}
              contentFit="contain"
            />
            <Text className="text-md text-center font-bold text-blue-700">
              Pending
            </Text>
            <Text className="text-md text-center font-bold">2000</Text>
          </Pressable>
        </Link>
        <Link href="/ekin" asChild>
          <Pressable>
            <Image
              source={require('../../../assets/image/diterima.png')}
              className="size-28 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
            <Text className="text-md text-center font-bold text-blue-700">
              Pending
            </Text>
            <Text className="text-md text-center font-bold">2000</Text>
          </Pressable>
        </Link>
        <Link href="/ekin" asChild>
          <Pressable>
            <Image
              source={require('../../../assets/image/ditolak.png')}
              className="size-28 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
            <Text className="text-md text-center font-bold text-blue-700">
              Pending
            </Text>
            <Text className="text-md text-center font-bold">2000</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
