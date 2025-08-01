import { Link } from 'expo-router';

import { type RekapStatusResponse } from '@/api';
import { Image, Pressable, Text, View } from '@/components/ui';

import { Title } from '../title';

interface Props {
  data: RekapStatusResponse | undefined;
}

export default function MenuKegiatanHarianBawahan({ data }: Props) {
  return (
    <View className="bg-whites mx-2 my-5 rounded-2xl bg-white shadow-lg">
      <Title
        text="Kegiatan Harian Bawahan"
        className="bg-[#287BDC]"
        textColor="text-[#287BDC]"
      />
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
            <Text className="text-md text-center font-bold">
              {data?.bulanan.pending}
            </Text>
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
              Diterima
            </Text>
            <Text className="text-md text-center font-bold">
              {' '}
              {data?.bulanan.setuju}
            </Text>
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
              Ditolak
            </Text>
            <Text className="text-md text-center font-bold">
              {' '}
              {data?.bulanan.tolak}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
