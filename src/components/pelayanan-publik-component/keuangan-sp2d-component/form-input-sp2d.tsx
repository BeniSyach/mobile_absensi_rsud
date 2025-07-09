/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { FileText, Search } from 'lucide-react-native';
import { useState } from 'react';
import React from 'react';
import { ActivityIndicator, TextInput } from 'react-native';
import { z } from 'zod';

import { type ResponseSPM } from '@/api/keuangan';
import { Text, TouchableOpacity, View } from '@/components/ui';

const nomorSchema = z.string().min(1, { message: 'Nomor SPM wajib diisi' });

interface FromInputSp2dProps {
  dataDiterima: (data: ResponseSPM) => void;
}

export default function FormInputSp2d({ dataDiterima }: FromInputSp2dProps) {
  const [nomor, setNomor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const validateNomor = async () => {
    try {
      setPending(true); // Set loading sebelum proses
      nomorSchema.parse(nomor);
      setError(null);

      const response = await axios.get(
        'https://keuda-bkad.deliserdangkab.go.id/api_spm/',
        {
          params: { id: nomor },
        }
      );

      dataDiterima(response.data);
      return response.data;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      } else if (axios.isAxiosError(e)) {
        const serverMessage =
          e.response?.data?.messages || 'Terjadi kesalahan pada server.';
        setError(serverMessage);
        alert(serverMessage);
      } else {
        alert('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setPending(false); // Set selesai meskipun sukses atau error
    }
  };

  return (
    <View>
      <View className="rounded-lg border border-gray-200 bg-white shadow">
        {/* Header Card: Background Biru */}
        <View className="flex-row items-center space-x-2 rounded-t-lg bg-[#53B175] px-4 py-3">
          <FileText size={24} color="#fff" />
          <Text className="text-lg font-semibold text-white">
            Cek Berkas SP2D
          </Text>
        </View>
        <View className="p-4">
          <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
            <TextInput
              placeholder="No. SPM (01/SPM/1.01.01-xxx/DS/2025)"
              className="flex-1 pr-3 text-base text-gray-700"
              value={nomor}
              onChangeText={setNomor}
              placeholderTextColor="#6B7280"
            />
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-full bg-[#53B175] px-4 py-2"
              onPress={validateNomor}
              disabled={pending}
            >
              {pending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Search size={16} color="white" />
                  <Text className="ml-1 font-semibold text-white">Cari</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          {error && <Text className="mt-2 text-red-600">{error}</Text>}
        </View>
      </View>
    </View>
  );
}
