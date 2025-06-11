import axios from 'axios';
import { FileText, Search } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { z } from 'zod';

import { type Permohonan } from '@/api/perizinan';
import { Text, TouchableOpacity, View } from '@/components/ui';

const nomorSchema = z
  .string()
  .min(1, { message: 'Nomor pendaftaran wajib diisi' })
  .regex(/^\d+$/, { message: 'Nomor hanya boleh angka' });

interface FromInputSeriDeliProps {
  dataDiterima: (data: Permohonan) => void;
}

export default function FromInputSeriDeli({
  dataDiterima,
}: FromInputSeriDeliProps) {
  const [nomor, setNomor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const validateNomor = async () => {
    try {
      nomorSchema.parse(nomor);
      setError(null);
      const response = await axios.post(
        'https://perizinan.deliserdangkab.go.id/penanaman_modal/',
        { nomorPermohonan: nomor },
        {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
        }
      );
      dataDiterima(response.data.data.permohonan[0]);
      return response.data;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      } else if (axios.isAxiosError(e)) {
        const serverMessage =
          e.response?.data?.messages || 'Terjadi kesalahan pada server.';
        setError(serverMessage);
        alert(serverMessage); // Menampilkan alert dari server
      } else {
        alert('Terjadi kesalahan yang tidak diketahui.');
      }
    }
  };
  return (
    <View>
      <View className="rounded-lg border border-gray-200 bg-white shadow">
        {/* Header Card: Background Biru */}
        <View className="flex-row items-center space-x-2 rounded-t-lg bg-[#2563EB] px-4 py-3">
          <FileText size={24} color="#fff" />
          <Text className="text-lg font-semibold text-white">
            Cek Status Permohonan
          </Text>
        </View>
        <View className="p-4">
          <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
            <TextInput
              placeholder="No. Pendaftaran (00192141011405xxxx)"
              className="flex-1 pr-3 text-base text-gray-700"
              keyboardType="number-pad"
              value={nomor}
              onChangeText={setNomor}
            />
            <TouchableOpacity
              className="flex-row items-center rounded-full bg-blue-500 px-4 py-2"
              onPress={validateNomor}
            >
              <Search size={16} color="white" />
              <Text className="ml-1 font-semibold text-white">Cari</Text>
            </TouchableOpacity>
          </View>
          {error && <Text className="mt-2 text-red-600">{error}</Text>}
        </View>
      </View>
    </View>
  );
}
