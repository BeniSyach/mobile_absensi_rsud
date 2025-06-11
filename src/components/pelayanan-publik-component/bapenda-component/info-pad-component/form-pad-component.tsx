import axios from 'axios';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { z } from 'zod';

import { type WajibPajak } from '@/api/bapenda';
import { Button, Input, View } from '@/components/ui';

import DataPadComponent from './data-pad-component';

const searchSchema = z.object({
  cari: z.string().min(1, 'NPWD/Nama/Alamat tidak boleh kosong'),
});

export default function FormPadComponent() {
  const [cari, setCari] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<WajibPajak[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const handleCari = async () => {
    const result = searchSchema.safeParse({ cari });
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
    setFormErrors({});
    setIsPending(true); // Set loading state
    try {
      const response = await axios.get(
        'https://dinkesds-simpus.deliserdangkab.go.id/php/ds-sehat/pelayanan-publik/bapenda/cek-info-pad.php',
        {
          params: {
            cari,
          },
        }
      );
      const result = response.data;
      if (!result) {
        Alert.alert('Data tidak ditemukan', result.PESAN);
        setData([]);
      } else {
        setData(result[0].data);
        console.log('data', result[0].data);
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
    <View className="m-2 flex-1">
      <Input
        placeholder="NPWPD/Nama/Alamat"
        value={cari}
        onChangeText={(text) => {
          setCari(text);
          setFormErrors((prev) => ({ ...prev, cari: '' })); // hapus error saat edit
        }}
        error={formErrors.cari}
      />
      <Button
        label="CARI"
        className="bg-[#007AFF]"
        loading={isPending}
        onPress={handleCari}
        icon={<Search size={18} color="white" />}
      />
      <DataPadComponent data={data} Pending={isPending} />
    </View>
  );
}
