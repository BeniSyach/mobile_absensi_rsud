/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { z } from 'zod';

import { type ResponPbb, type Tagihan } from '@/api/bapenda';
import { Button, Input, MaskedInput, Text } from '@/components/ui';

import DataNopNewComponent from './data-nop-new-component';
import ListNopComponent from './list-nop-component';

const searchSchema = z.object({
  nik: z.string().min(16, 'NIK harus 16 digit'),
  nomor: z.string().min(1, 'NOP tidak boleh kosong'),
});

export default function CariNopComponent() {
  const [nik, setNik] = useState('');
  const [nomor, setNomor] = useState('');
  const [data, setData] = useState<ResponPbb | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tagihanData, setTagihanData] = useState<Tagihan[]>([]); // State untuk menampung TAGIHAN
  const [isPending, setIsPending] = useState(false);
  const handleCari = async () => {
    const result = searchSchema.safeParse({ nik, nomor });
    if (!result.success) {
      // Mapping error per field
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    // Reset error jika valid
    setFormErrors({});
    setIsPending(true); // Set loading state
    try {
      const response = await axios.get(
        'https://dinkesds-simpus.deliserdangkab.go.id/php/ds-sehat/pelayanan-publik/bapenda/cek-info-pbb.php',
        {
          params: {
            nik,
            nop: nomor,
          },
        }
      );
      const result = response.data;
      if (!result || !result.TAGIHAN || result.TAGIHAN.length === 0) {
        Alert.alert('Data tidak ditemukan', result.PESAN);
        setData(null);
        setTagihanData([]);
      } else {
        setData(result);
        setTagihanData(result.TAGIHAN);
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          'Terjadi kesalahan saat mengambil data.'
        : String(error);
      Alert.alert('Terjadi Kesalahan', errorMessage);
      console.error('Error fetching data:', error);
    } finally {
      setIsPending(false); // Set selesai loading
    }
  };
  return (
    <View className="m-2">
      <MaskedInput
        type="custom"
        options={{ mask: '99.99.999.999.999.9999.9' }}
        placeholder="00.00.000.000.000.0000.0"
        value={nomor}
        onChangeText={(text) => {
          setNomor(text);
          setFormErrors((prev) => ({ ...prev, nomor: '' })); // hapus error saat edit
        }}
        error={formErrors.nomor}
        keyboardType="number-pad"
      />
      <Input
        placeholder="NIK"
        value={nik}
        onChangeText={(text) => {
          setNik(text);
          setFormErrors((prev) => ({ ...prev, nik: '' })); // hapus error saat edit
        }}
        error={formErrors.nik}
        keyboardType="number-pad"
      />
      <Button
        label="CARI"
        icon={<Search size={18} color="white" />}
        className="bg-[#007AFF]"
        onPress={handleCari}
        loading={isPending}
      />
      {data && <DataNopNewComponent data={data} nik={nik} />}
      {data && <Text className="m-2 text-xl font-bold">Detail Pajak</Text>}
      <ListNopComponent dataTagihan={tagihanData} Pending={isPending} />
    </View>
  );
}
