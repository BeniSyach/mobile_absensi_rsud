/* eslint-disable max-lines-per-function */
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { type RekapStatusResponse } from '@/api';
import { Image, Text } from '@/components/ui';

import { Title } from '../title';

interface Props {
  data: RekapStatusResponse | undefined;
  isPending: boolean;
  isError: boolean;
}

export default function MenuKegiatanHarianBawahan({
  data,
  isPending,
  isError,
}: Props) {
  return (
    <View className="mx-2 my-5 rounded-2xl bg-white shadow-lg">
      <Title
        text="Kegiatan Harian Bawahan"
        className="bg-[#287BDC]"
        textColor="text-[#287BDC]"
      />

      {/* Loading State */}
      {isPending && (
        <View className="items-center justify-center p-6">
          <Progress.Circle size={40} indeterminate color="#287BDC" />
          <Text className="mt-2 text-sm text-gray-600">Memuat data...</Text>
        </View>
      )}

      {/* Error State */}
      {isError && !isPending && (
        <View className="items-center justify-center p-6">
          <Text className="text-base font-semibold text-red-600">
            Data tidak bisa dimuat
          </Text>
        </View>
      )}

      {/* Success State */}
      {!isPending && !isError && (
        <View className="flex-row items-center justify-between p-2">
          <Link href="/ekin" asChild>
            <Pressable>
              <Image
                source={require('../../../assets/image/pending.png')}
                className="size-24"
                transition={1000}
                contentFit="contain"
              />
              <Text className="text-center text-sm font-bold text-blue-700">
                Pending
              </Text>
              <Text className="text-center text-lg font-extrabold">
                {data?.bulanan.pending ?? 0}
              </Text>
            </Pressable>
          </Link>

          <Link href="/ekin" asChild>
            <Pressable>
              <Image
                source={require('../../../assets/image/diterima.png')}
                className="size-24 rounded-lg"
                transition={1000}
                contentFit="contain"
              />
              <Text className="text-center text-sm font-bold text-blue-700">
                Diterima
              </Text>
              <Text className="text-center text-lg font-extrabold">
                {data?.bulanan.setuju ?? 0}
              </Text>
            </Pressable>
          </Link>

          <Link href="/ekin" asChild>
            <Pressable>
              <Image
                source={require('../../../assets/image/ditolak.png')}
                className="size-24 rounded-lg"
                transition={1000}
                contentFit="contain"
              />
              <Text className="text-center text-sm font-bold text-blue-700">
                Ditolak
              </Text>
              <Text className="text-center text-lg font-extrabold">
                {data?.bulanan.tolak ?? 0}
              </Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
}
