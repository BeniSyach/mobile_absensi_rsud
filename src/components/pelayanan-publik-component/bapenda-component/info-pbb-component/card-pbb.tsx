import { Text, View } from 'react-native';

import { type Tagihan } from '@/api/bapenda';

interface CardProps {
  dataTagihan: Tagihan;
}

export default function CardPbb({ dataTagihan }: CardProps) {
  const formatRupiah = (value: any) => {
    if (!value) return 'Rp0';
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
  };
  return (
    <View className="m-3 rounded-2xl bg-white p-5 shadow-md shadow-gray-300">
      {/* Header */}
      <Text className="text-primary mb-4 text-center text-base font-bold">
        Tagihan Pajak PBB
      </Text>

      {/* Detail Data */}
      <View className="space-y-3">
        {[
          ['Tahun Pajak', dataTagihan.THN_PAJAK_SPPT],
          ['Tanggal Jatuh Tempo', dataTagihan.J_TEMPO],
          ['Pokok Pajak', formatRupiah(dataTagihan.POKOK)],
          ['Denda', formatRupiah(dataTagihan.DENDA)],
          ['Total', formatRupiah(dataTagihan.TOTAL)],
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

        {/* Status Badge */}
        <View className="mt-2 flex-row items-start">
          <Text className="w-40 text-sm font-medium text-gray-700">Status</Text>
          <Text className="mr-1 text-sm text-gray-600">:</Text>
          <View
            className={`rounded-full px-3 py-1
            ${
              dataTagihan.STATUS?.toString() === 'LUNAS'
                ? 'bg-green-100'
                : dataTagihan.STATUS?.toString() === 'BELUM LUNAS'
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
            }`}
          >
            <Text
              className={`
              text-xs font-semibold
              ${
                dataTagihan.STATUS?.toString() === 'LUNAS'
                  ? 'text-green-700'
                  : dataTagihan.STATUS?.toString() === 'BELUM LUNAS'
                    ? 'text-red-700'
                    : 'text-yellow-700'
              }`}
            >
              {dataTagihan.STATUS ?? '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
