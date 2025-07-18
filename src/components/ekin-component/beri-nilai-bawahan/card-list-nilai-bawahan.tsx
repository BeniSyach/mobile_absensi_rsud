import { Link } from 'expo-router';

import { type Tagihan } from '@/api/bapenda';
import { Pressable, Text, View } from '@/components/ui';

interface CardProps {
  dataTagihan: Tagihan;
}

export default function CardNilaiBawahan({ dataTagihan }: CardProps) {
  console.log(dataTagihan);
  return (
    <Link href="/ekin/beri-nilai-bawahan/list-kegiatan-harian-bawahan" asChild>
      <Pressable>
        <View className="m-4 flex-row items-center rounded-xl border border-gray-300 bg-white p-4 shadow-lg">
          {/* Avatar */}
          <View className="mr-4 size-16 items-center justify-center rounded-full bg-blue-500">
            <Text className="text-3xl text-white">👤</Text>
          </View>

          {/* Info + Status */}
          <View className="flex-1">
            {/* Nama */}
            <Text className="text-lg font-bold text-black">
              Anto Untung, S.Teh
            </Text>

            {/* NIP */}
            <Text className="text-base text-gray-500">
              NIP : 99999999999999999999
            </Text>

            {/* Jabatan */}
            <Text className="text-base text-sky-600">
              Administrator Kesehatan
            </Text>

            {/* Status */}
            <View className="mt-2 flex-row gap-2">
              {/* Belum Disetujui */}
              <View className="flex-row items-center rounded-md bg-yellow-500 px-2 py-1">
                <Text className="text-xs font-bold text-red-700">999</Text>
                <Text className="ml-1 text-sm text-red-700">
                  | Belum Disetujui
                </Text>
              </View>

              {/* Disetujui */}
              <View className="flex-row items-center rounded-md bg-blue-600 px-2 py-1">
                <Text className="text-xs font-bold text-white">2</Text>
                <Text className="ml-1 text-sm text-white">| Disetujui</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
