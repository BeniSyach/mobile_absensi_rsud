import { useRouter } from 'expo-router';

import { type WajibPajak } from '@/api/bapenda';
import { Text, TouchableOpacity, View } from '@/components/ui';

interface CardPropsPad {
  data: WajibPajak;
}

export default function CardPad({ data }: CardPropsPad) {
  const router = useRouter();
  return (
    <View className="m-2 rounded-lg bg-white p-4 shadow">
      <View className="space-y-1">
        {[
          ['NPWD', data.NPWPD],
          ['Nama', data.NAMA_WP],
          ['Alamat', data.ALAMAT],
          ['Kelurahan', data.KELURAHAN],
          ['Kecamatan', data.KECAMATAN],
          ['Jenis', data.JENIS],
          ['Golongan', data.GOLONGAN],
          ['Tgl Daftar', data.TGL_DAFTAR],
          ['No. Pengukuhan', data.NO_PENGUKUHAN],
          ['Status', data.STATUS],
        ].map(([label, value], index) => (
          <View key={index} className="flex-row">
            <Text className="dark:text-dark-500 w-40 text-sm font-bold text-gray-600">
              {label}
            </Text>
            <Text className="dark:text-dark-500 mr-1 text-sm text-gray-600">
              :
            </Text>
            <Text className="dark:text-dark-500 flex-1 text-sm font-semibold text-gray-700">
              {value}
            </Text>
          </View>
        ))}
        <View className="my-3 items-center">
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/pelayanan-publik/bapenda/info-pad/detail-pad',
                params: {
                  data: JSON.stringify(data), // Kirim data sebagai string (harus di-decode nanti)
                },
              });
            }}
            className="rounded bg-blue-500 px-4 py-2"
          >
            <Text className="font-semibold text-white">Detail Pajak</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
