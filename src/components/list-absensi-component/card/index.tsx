/* eslint-disable max-lines-per-function */
import { LogIn, LogOut } from 'lucide-react-native';

import { type AbsenMasuk } from '@/api';
import { Text, View } from '@/components/ui';

interface CardProps {
  data: AbsenMasuk;
}

export const Card = ({ data }: CardProps) => {
  // Memisahkan tanggal dan jam dari waktu_masuk dan waktu_pulang
  const formatTime = (datetime?: string) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // tampilkan detik
      hour12: false, // format 24 jam
    }); // output: "08:05:12"
  };

  const formatDate = (datetime?: string) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    // Format: 25 Agustus 2025
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View className="m-4 rounded-xl bg-gray-200 p-3 shadow">
      <View className="absolute inset-y-0 left-0 w-2 rounded-l-xl bg-blue-500" />
      {/* Header tanggal + icon masuk/pulang */}
      <View className="mb-2 flex-row">
        <Text className="flex-1 text-xs font-semibold text-black">
          {formatDate(data.waktu_masuk)}
        </Text>

        {/* Masuk */}
        <View className="flex-1 flex-row items-center justify-center space-x-1 border-x border-gray-300">
          <LogIn size={14} color="#16A34A" />
          <Text className="text-center text-xs text-black">Masuk</Text>
        </View>

        {/* Pulang */}
        <View className="flex-1 flex-row items-center justify-center space-x-1">
          <LogOut size={14} color="#DC2626" />
          <Text className="text-center text-xs text-black">Pulang</Text>
        </View>
      </View>

      {/* Row 1: Shift / Masuk / Pulang */}
      <View className="flex-row pt-2">
        <Text className="flex-1 border-r border-gray-300 pr-2 text-xs text-black">
          {data.nama_shift}
        </Text>

        {/* Masuk sebagai badge biru */}
        <View className="flex-1 items-center justify-center border-r border-gray-300 px-2">
          <Text className="rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
            {formatTime(data.waktu_masuk)}
          </Text>
        </View>

        {/* Pulang sebagai badge biru */}
        <View className="flex-1 items-center justify-center pl-2">
          <Text className="rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
            {formatTime(data.absen_pulang[0]?.waktu_pulang)}
          </Text>
        </View>
      </View>

      {/* Row 2: Waktu kerja / ket masuk / ket pulang */}
      <View className="flex-row pt-1">
        <Text className="flex-1 border-r border-gray-300 pr-2 text-[11px] text-black">
          {data.nama_hari_waktu_kerja || '-'}
        </Text>
        <Text className="flex-1 border-r border-gray-300 px-2 text-center text-[11px] text-black">
          {data.keterangan || '-'}
        </Text>
        <Text className="flex-1 pl-2 text-center text-[11px] text-black">
          {data.absen_pulang[0]?.keterangan || '-'}
        </Text>
      </View>

      {/* Row 3: Waktu update */}
      <View className="mt-2 border-t border-gray-200 pt-1">
        <Text className="text-[11px] text-black">
          Waktu Kerja :{' '}
          {data.jam_mulai_waktu_kerja ? data.jam_mulai_waktu_kerja : '--:--:--'}
          {'    '}-{'    '}
          {data.jam_selesai_waktu_kerja
            ? data.jam_selesai_waktu_kerja
            : '--:--:--'}
        </Text>
      </View>
    </View>
  );
};
