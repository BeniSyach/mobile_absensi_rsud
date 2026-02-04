import { Link } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { type CutiPegawaiVerif } from '@/api/cuti';
import { Text } from '@/components/ui';

interface CardProps {
  dataCardbawahan: CutiPegawaiVerif;
}

export default function CardPengajuanCuti({ dataCardbawahan }: CardProps) {
  return (
    <Link
      href={{
        pathname: '/cuti/pengajuan/detail-pengajuan-cuti',
        params: {
          data: JSON.stringify(dataCardbawahan),
        },
      }}
      asChild
    >
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
              {dataCardbawahan?.nama_pegawai ?? '-'}
            </Text>

            {/* NIP */}
            <Text className="text-base text-gray-500">
              {dataCardbawahan?.nama_unit_kerja ?? '-'}
            </Text>

            {/* Status */}
            <View className="mt-2 flex-row justify-end gap-2">
              {/* Disetujui */}
              <View className="flex-row items-center rounded-md bg-blue-600 px-2 py-1">
                <Eye size={24} color="white" />
                <Text className="ml-1 text-base text-white">
                  Lihat Berkas Cuti
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
