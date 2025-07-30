import { Search } from 'lucide-react-native';
import { TextInput } from 'react-native';

import { DateInputOriginal, View } from '@/components/ui';

interface Props {
  search: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  onSearchChange: (val: string) => void;
  onTanggalAwalChange: (val: string) => void;
  onTanggalAkhirChange: (val: string) => void;
}

export default function FormListKegiatan({
  search,
  tanggalAwal,
  tanggalAkhir,
  onSearchChange,
  onTanggalAwalChange,
  onTanggalAkhirChange,
}: Props) {
  return (
    <View className="px-4 pt-6">
      {/* Search Bar */}
      <View className="mb-4 flex-row items-center rounded-xl border border-gray-300 bg-gray-200 px-4 py-3 shadow-sm">
        <Search className="mr-3 size-5" color="black" strokeWidth={2.5} />
        <TextInput
          className="flex-1 text-base text-black"
          placeholder="Cari"
          placeholderTextColor="#6B7280"
          value={search}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Tanggal Picker */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <DateInputOriginal
            label="Tanggal Awal"
            placeholder="Pilih tanggal awal"
            value={tanggalAwal}
            onChange={onTanggalAwalChange}
          />
        </View>

        <View className="flex-1">
          <DateInputOriginal
            label="Tanggal Akhir"
            placeholder="Pilih tanggal akhir"
            value={tanggalAkhir}
            onChange={onTanggalAkhirChange}
          />
        </View>
      </View>
    </View>
  );
}
