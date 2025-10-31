/* eslint-disable max-lines-per-function */
import { Search } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput } from 'react-native';

import { DateInputOriginal, View } from '@/components/ui';

type FormValues = {
  search: string;
  tanggalAwal: string;
  tanggalAkhir: string;
};

interface Props {
  defaultValues: FormValues;
  onChange: (val: FormValues) => void;
}

export default function FormListKegiatan({ defaultValues, onChange }: Props) {
  const { setValue, watch } = useForm<FormValues>({
    defaultValues,
  });

  const values = watch();

  // ✅ hanya panggil onChange kalau values berubah
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  return (
    <View className="px-4 pt-6">
      {/* Search */}
      <View className="mb-4 flex-row items-center rounded-xl border border-gray-300 bg-gray-200 px-4 py-3 shadow-sm">
        <Search className="mr-3 size-5" color="black" strokeWidth={2.5} />
        <TextInput
          className="flex-1 text-base text-black"
          placeholder="Cari"
          placeholderTextColor="#6B7280"
          value={values.search}
          onChangeText={(text) => setValue('search', text)}
        />
      </View>

      {/* Tanggal */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <DateInputOriginal
            label="Tanggal Awal"
            placeholder="Pilih tanggal awal"
            value={values.tanggalAwal}
            onChange={(val) => setValue('tanggalAwal', val)}
          />
        </View>

        <View className="flex-1">
          <DateInputOriginal
            label="Tanggal Akhir"
            placeholder="Pilih tanggal akhir"
            value={values.tanggalAkhir}
            onChange={(val) => setValue('tanggalAkhir', val)}
          />
        </View>
      </View>
    </View>
  );
}
