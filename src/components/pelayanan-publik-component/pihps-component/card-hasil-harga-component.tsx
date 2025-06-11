import { Dimensions } from 'react-native';

import { type HargaKomoditiPasarRataRata } from '@/api/disperindag';
import { Text, View } from '@/components/ui';

interface dataresHarga {
  data: HargaKomoditiPasarRataRata;
}

const CARD_WIDTH = (Dimensions.get('window').width - 32 - 8) / 2;

export default function CardHargaRata({ data }: dataresHarga) {
  return (
    <View
      style={{ width: CARD_WIDTH - 15, marginBottom: 16, marginRight: 16 }}
      className="min-h-[130px] justify-between rounded-xl bg-white p-4 shadow"
    >
      <Text className="text-center font-semibold">{data.nama_komoditi}</Text>
      <Text className="text-center text-gray-500">{data.satuan}</Text>
      <Text className="text-center font-bold text-blue-600">
        {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(parseInt(data.harga_rata_rata))}
      </Text>
    </View>
  );
}
