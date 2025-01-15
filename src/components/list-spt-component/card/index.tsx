import { Env } from '@env';
import * as WebBrowser from 'expo-web-browser';
import { Eye, FileText } from 'lucide-react-native';
import { Alert } from 'react-native';

import { type GetAllSPTResponse } from '@/api';
import { Pressable, Text, View } from '@/components/ui';

interface CardProps {
  data: GetAllSPTResponse; // menerima objek tunggal SPT
}

export const CardSPT = ({ data }: CardProps) => {
  const handleViewPDF = async () => {
    try {
      const pdfUri = `${Env.API_URL}/storage/${data.file_spt}`; // pastikan `pdf_url` ada pada data yang diterima
      if (pdfUri) {
        // Menggunakan expo-web-browser untuk membuka PDF di dalam browser atau aplikasi PDF
        await WebBrowser.openBrowserAsync(pdfUri);
      } else {
        Alert.alert('Error', 'PDF not found');
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Failed to open PDF');
    }
  };

  return (
    <View className="my-4 flex-row items-center rounded-lg bg-white p-4 shadow">
      {/* Menampilkan gambar user */}
      <FileText color="black" size={32} className="mr-4" />
      <View className="flex-1">
        {/* Menampilkan nama user */}
        <Text className=" dark:text-dark-500 text-lg font-bold">
          {data.user.name}
        </Text>

        {/* Menampilkan tanggal dan waktu SPT */}
        <Text className=" dark:text-dark-500 text-sm text-gray-600">
          Tanggal SPT: {data.tanggal_spt}
        </Text>
        <Text className=" dark:text-dark-500 text-sm text-gray-600">
          Waktu SPT: {data.waktu_spt}
        </Text>

        {/* Menampilkan lama acara dan lokasi */}
        <Text className=" dark:text-dark-500 mt-2 text-sm text-gray-600">
          Lama Acara: {data.lama_acara} jam
        </Text>
        <Text className=" dark:text-dark-500 text-sm text-gray-600">
          Lokasi: {data.lokasi_spt}
        </Text>
      </View>
      <Pressable className="p-2" onPress={handleViewPDF}>
        <Eye color="blue" size={24} />
      </Pressable>
    </View>
  );
};
