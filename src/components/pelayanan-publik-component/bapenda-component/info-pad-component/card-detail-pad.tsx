import { type TagihanPad } from '@/api/bapenda';
import { Text, View } from '@/components/ui';

interface dataDetailPad {
  data: TagihanPad;
}

export default function CardDetailPad({ data }: dataDetailPad) {
  const formatRupiah = (value: any) => {
    if (!value) return 'Rp0';
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
  };
  return (
    <View className="m-3 rounded-xl bg-white p-5 shadow-md shadow-gray-300">
      <Text className="text-primary mb-4 text-center text-lg font-bold">
        Rincian Tagihan Pajak
      </Text>
      <View className="space-y-2">
        {[
          ['Masa Pajak', data.MASA_PAJAK],
          ['Cara Penetapan', data.CARA_PENETAPAN],
          ['Tgl Ketetapan', data.TGL_KETETAPAN],
          ['Omset', formatRupiah(data.OMSET)],
          ['Jumlah Pajak', formatRupiah(data.JLH_PAJAK)],
          ['Jatuh Tempo', data.J_TEMPO],
          ['Tgl Setor', data.TGL_SETOR],
          ['Jumlah Setor', formatRupiah(data.JLH_SETOR)],
        ].map(([label, value], index) => (
          <View key={index} className="flex-row items-start">
            <Text className="w-40 text-sm font-medium text-gray-700">
              {label}
            </Text>
            <Text className="mr-1 text-sm text-gray-600">:</Text>
            <Text className="flex-1 text-sm font-semibold text-gray-800">
              {value ?? '-'}
            </Text>
          </View>
        ))}
        <View className="mt-3 flex-row items-center">
          <Text className="w-40 text-sm font-medium text-gray-700">Status</Text>
          <Text className="mr-1 text-sm text-gray-600">:</Text>
          <View
            className={`
            rounded-full px-3 py-1 
            ${
              data.STATUS_BAYAR === 'TERBAYAR'
                ? 'bg-green-100'
                : data.STATUS_BAYAR === 'BELUM DIBAYAR'
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
            }
          `}
          >
            <Text
              className={`
              text-xs font-semibold 
              ${
                data.STATUS_BAYAR === 'TERBAYAR'
                  ? 'text-green-700'
                  : data.STATUS_BAYAR === 'BELUM DIBAYAR'
                    ? 'text-red-700'
                    : 'text-yellow-700'
              }
            `}
            >
              {data.STATUS_BAYAR ?? '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
