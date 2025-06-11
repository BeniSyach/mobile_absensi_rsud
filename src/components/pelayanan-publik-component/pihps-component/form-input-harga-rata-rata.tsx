/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { useState } from 'react';
import { Alert } from 'react-native';
import { z } from 'zod';

import {
  type HargaKomoditiPasarRataRata,
  type MasterDataKomoditas,
} from '@/api/disperindag';
import {
  Button,
  DateInputOriginal,
  type OptionType,
  View,
} from '@/components/ui';
import { SelectMultiple } from '@/components/ui/select-multiple';

export const formScheme = z.object({
  startDate: z.string().min(4, 'Tanggal Awal wajib diisi'),
  endDate: z.string().min(4, 'Tanggal Akhir wajib diisi'),
});

interface MasterDataRatarata {
  Komoditas: MasterDataKomoditas[];
  responDataHarga: (data: HargaKomoditiPasarRataRata[]) => void;
}
export default function FormInputHargaRata({
  Komoditas,
  responDataHarga,
}: MasterDataRatarata) {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
  });
  const [komoditas_id, setKomoditas_id] = useState<(string | number)[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: '' }));
  };
  const dataKomoditas: OptionType[] = Komoditas.map((k) => ({
    label: k.nama,
    value: k.id,
  }));
  const handleSubmit = async () => {
    const result = formScheme.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }
    setIsPending(true);
    const komoditasIdsString = komoditas_id.join(',');
    try {
      const response = await axios.get(
        'https://pihps.deliserdangkab.go.id/api/harga-rata-komoditi',
        {
          params: {
            komoditi_ids: komoditasIdsString,
            start_date: form.startDate,
            end_date: form.endDate,
          },
          headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': '', // jika tidak diperlukan bisa dihapus
          },
        }
      );
      responDataHarga(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const message =
          error.response.data?.messages || 'Permintaan tidak valid.';
        Alert.alert('Permintaan Gagal', message);
      } else {
        Alert.alert('Gagal Menghubungi Server', 'Server Tidak Dapat Terhubung');
      }
    } finally {
      setIsPending(false);
    }
  };
  return (
    <View className="space-y-4">
      <SelectMultiple
        label="Komoditas"
        value={komoditas_id}
        error={formErrors.komoditas_id}
        onSelect={(selectedValues) => setKomoditas_id(selectedValues)}
        options={dataKomoditas}
        placeholder="Pilih Komoditas"
      />

      <View className="flex-row space-x-4">
        <View className="mr-2 flex-1">
          <DateInputOriginal
            label="Tanggal Awal"
            placeholder="Pilih tanggal"
            value={form.startDate}
            error={formErrors.startDate}
            onChange={(val) => handleChange('startDate', val)}
          />
        </View>

        <View className="ml-2 flex-1">
          <DateInputOriginal
            label="Tanggal Akhir"
            placeholder="Pilih tanggal"
            value={form.endDate}
            error={formErrors.endDate}
            onChange={(val) => handleChange('endDate', val)}
          />
        </View>
      </View>
      <Button label="Filter" onPress={handleSubmit} loading={isPending} />
    </View>
  );
}
