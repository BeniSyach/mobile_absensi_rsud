import { type Usaha } from '@/api/sada-sada';
import { Text, View } from '@/components/ui';

interface CardPropsUmkm {
  data: Usaha;
}

export default function CardDataUmkm({ data }: CardPropsUmkm) {
  return (
    <View className="m-3 space-y-6">
      {/* Card 1: Data Usaha */}
      <View className="relative mb-5 rounded-2xl bg-white p-5 pt-8 shadow-md shadow-gray-300">
        <View className="absolute -top-3 left-4 z-10 rounded-md bg-blue-500 px-3 py-1">
          <Text className="text-xs font-semibold text-white">Data Usaha</Text>
        </View>

        <View className="space-y-3">
          {[
            ['Nama Usaha', data.namaUsaha],
            ['Jenis Usaha', data.jenisUsaha],
            ['Alamat Usaha', data.alamatUsaha],
            ['Desa', data.namaDesa],
            ['Kecamatan', data.namaKecamatan],
          ].map(([label, value], index) => (
            <View key={index} className="flex-row items-start">
              <Text className="w-40 text-sm font-medium text-gray-700">
                {label}
              </Text>
              <Text className="mr-1 text-sm text-gray-600">:</Text>
              <Text className="flex-1 text-sm font-semibold text-gray-900">
                {value ?? '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Card 2: Data Legalitas Usaha */}
      <View className="relative mt-3 rounded-2xl bg-white p-5 pt-8 shadow-md shadow-gray-300">
        <View className="absolute -top-3 left-4 z-10 rounded-md bg-blue-500 px-3 py-1">
          <Text className="text-xs font-semibold text-white">
            Data Legalitas Usaha
          </Text>
        </View>

        <View className="space-y-3">
          {[
            ['Nomor Induk Berusaha', data.umkmUsaha],
            ['PIRT / BPOM', data.pirt_bpom],
            ['Halal', data.halal],
            ['Tahun Berdiri', data.tahunBerdiri],
          ].map(([label, value], index) => (
            <View key={index} className="flex-row items-start">
              <Text className="w-40 text-sm font-medium text-gray-700">
                {label}
              </Text>
              <Text className="mr-1 text-sm text-gray-600">:</Text>
              <Text className="flex-1 text-sm font-semibold text-gray-900">
                {value ?? '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
