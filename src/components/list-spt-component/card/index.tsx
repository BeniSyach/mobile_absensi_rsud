/* eslint-disable max-lines-per-function */
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Eye } from 'lucide-react-native';
import { Alert, Pressable, View } from 'react-native';

import { type SptData } from '@/api';
import { useViewSPT } from '@/api/spt/view-spt';
import { Text } from '@/components/ui';

interface CardProps {
  dataSPT: SptData;
}

export const CardSPT = ({ dataSPT }: CardProps) => {
  // Tempatkan hook di level atas komponen
  const { refetch, isFetching } = useViewSPT({
    variables: {
      userId: Number(dataSPT?.nik),
      file: dataSPT?.file_spt,
    },
    enabled: false, // agar hanya dijalankan saat refetch dipanggil
  });

  const formatTime = (datetime?: string) => {
    if (!datetime) return '-';

    // kalau format "2025-09-02T03:19:00.000000Z"
    const timePart = datetime.split('T')[1]?.split('.')[0];
    return timePart ?? '-';
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

  const statusConfig: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    null: { label: 'Pending', bg: 'bg-yellow-200', text: 'text-yellow-800' },
    '1': { label: 'Disetujui', bg: 'bg-green-200', text: 'text-green-800' },
    '0': { label: 'Ditolak', bg: 'bg-red-200', text: 'text-red-800' },
  };

  const key = dataSPT.status === null ? 'null' : String(dataSPT.status);
  const { label, bg, text } = statusConfig[key];

  const handleViewPDF = async () => {
    try {
      const { data: buffer } = await refetch();
      if (!buffer) {
        Alert.alert('Error', 'Data PDF tidak ditemukan');
        return;
      }

      const base64 = Buffer.from(buffer).toString('base64');
      const fileUri = `${FileSystem.cacheDirectory}temp-spt-${Date.now()}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Error', 'Fitur berbagi tidak tersedia di perangkat ini');
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Buka atau bagikan file PDF',
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal membuka PDF');
    }
  };

  return (
    <View className="relative m-4 rounded-xl bg-gray-200 p-3 shadow">
      {/* Garis biru kiri */}
      <View className="absolute inset-y-0 left-0 w-2 rounded-l-xl bg-blue-500" />

      {/* Header row */}
      <View className="flex-row">
        <Text className="flex-1 border-r border-gray-400 text-center text-xs font-semibold text-black">
          Tanggal SPT
        </Text>
        <Text className="flex-1 border-r border-gray-400 text-center text-xs font-semibold text-black">
          Waktu SPT
        </Text>
        <Text className="flex-1 text-center text-xs font-semibold text-black">
          Lokasi
        </Text>
      </View>

      {/* Value row */}
      <View className="mt-1 flex-row">
        <Text className="flex-1 border-r border-gray-300 text-center text-xs text-black">
          {formatDate(dataSPT.tanggal_spt)}
        </Text>
        <Text className="flex-1 border-r border-gray-300 text-center text-xs text-black">
          {formatTime(dataSPT.waktu_spt)}
        </Text>
        <Text className="flex-1 text-center text-xs text-black">
          {dataSPT.lokasi_spt}
        </Text>
      </View>

      {/* Row 3: icon + lama acara + status */}
      <View className="mt-2 flex-row">
        <Pressable
          onPress={handleViewPDF}
          disabled={isFetching}
          className="flex-1 items-center border-r border-gray-300"
        >
          <Eye size={18} color="black" />
          <Text className="text-[11px] text-black">Lihat SPT</Text>
        </Pressable>

        <View className="flex-1 items-center border-r border-gray-300">
          <Text className="text-xs font-semibold text-black">Lama Acara</Text>
          <Text className="text-xs text-black">{dataSPT.lama_acara}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-xs font-semibold text-black">Status</Text>
          <Text
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${bg} ${text}`}
          >
            {label}
          </Text>
        </View>
      </View>

      {/* Row 4: alasan tolak */}
      {dataSPT.alasan_tolak && (
        <View className="mt-3">
          <Text className="mb-1 text-[11px] font-semibold text-gray-600">
            Alasan Ditolak :
          </Text>

          <View className="rounded-md border border-gray-400 bg-red-50 p-2">
            <Text className="text-[11px] leading-4 text-black">
              {dataSPT.alasan_tolak}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
