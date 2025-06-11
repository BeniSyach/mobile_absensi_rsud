import { type ResponPbb } from '@/api/bapenda';
import { Text, View } from '@/components/ui';

interface dataNOPPbb {
  data: ResponPbb;
  nik: string;
}

export default function DataNopNewComponent({ data, nik }: dataNOPPbb) {
  return (
    <View className="m-3 rounded-2xl bg-white p-6 shadow-lg shadow-gray-300">
      {/* Header */}
      <Text className="text-primary mb-5 text-center text-lg font-bold">
        Informasi Objek Pajak
      </Text>

      {/* Detail Informasi */}
      <View className="mb-6 space-y-3">
        {[
          ['NOP', data.NOP],
          ['Nama', data.NAMA],
          ['NIK', nik],
          ['Alamat', data.ALAMAT_WP],
          ['Kelurahan', '-'],
          ['Kecamatan', '-'],
          ['L. Tanah', `${data.LUAS_BUMI} M2`],
          ['L. Bangunan', `${data.LUAS_BANGUNAN} M2`],
        ].map(([label, value], idx) => (
          <View key={idx} className="flex-row items-start">
            <Text className="w-28 text-sm font-medium text-gray-700">
              {label}
            </Text>
            <Text className="mr-1 text-sm text-gray-600">:</Text>
            <Text className="flex-1 text-sm font-semibold text-gray-900">
              {value ?? '-'}
            </Text>
          </View>
        ))}
      </View>

      {/* Tombol Aksi */}
      {/* <View className="flex-row space-x-3">
        <TouchableOpacity className="flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 shadow-md shadow-blue-300 active:bg-blue-700">
          <Text className="text-sm font-semibold text-white">Riwayat</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center justify-center rounded-lg bg-red-600 px-4 py-3 shadow-md shadow-red-300 active:bg-red-700">
          <Text className="text-sm font-semibold text-white">NJOP</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
