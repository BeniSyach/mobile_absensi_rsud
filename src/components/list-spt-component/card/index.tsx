/* eslint-disable max-lines-per-function */
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Eye, FileText } from 'lucide-react-native';
import { Alert } from 'react-native';

import { type SptData } from '@/api';
import { useViewSPT } from '@/api/spt/view-spt';
import { Pressable, Text, View } from '@/components/ui';

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
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Gagal membuka PDF');
    }
  };

  return (
    <View className="my-4 flex-row items-center rounded-lg bg-white p-4 shadow">
      <FileText color="black" size={32} className="mr-4" />
      <View className="flex-1">
        <Text className="dark:text-dark-500 text-sm text-gray-600">
          Tanggal SPT: {dataSPT.tanggal_spt}
        </Text>
        <Text className="dark:text-dark-500 text-sm text-gray-600">
          Waktu SPT: {dataSPT.waktu_spt}
        </Text>
        <Text className="dark:text-dark-500 mt-2 text-sm text-gray-600">
          Lama Acara: {dataSPT.lama_acara} Hari
        </Text>
        <Text className="dark:text-dark-500 text-sm text-gray-600">
          Lokasi: {dataSPT.lokasi_spt}
        </Text>
        {/* Status SPT */}
        <Text
          className={`
        mt-2 text-sm font-semibold
        ${
          dataSPT.status?.toString() === '1'
            ? 'text-green-600'
            : dataSPT.status?.toString() === '0'
              ? 'text-red-600'
              : 'text-yellow-600'
        }
      `}
        >
          Status:{' '}
          {dataSPT.status?.toString() === '1'
            ? 'SPT diverifikasi Atasan'
            : dataSPT.status?.toString() === '0'
              ? 'SPT ditolak Atasan'
              : 'Menunggu verifikasi Atasan'}
        </Text>
      </View>
      <Pressable className="p-2" onPress={handleViewPDF} disabled={isFetching}>
        <Eye color="blue" size={24} />
      </Pressable>
    </View>
  );
};
