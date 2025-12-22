/* eslint-disable max-lines-per-function */
import { Search } from 'lucide-react-native';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native';

import { type UnitKerjaSimpeg, useUnitKerjaSimpeg } from '@/api';
import { View } from '@/components/ui';
import { RemoteSelect } from '@/components/ui/remote-select';

type FormValues = {
  search: string;
  kode_opd: string;
};

interface Props {
  defaultValues: FormValues;
  onChange: (val: FormValues) => void;
}

export default function FormListPengajuan({ defaultValues, onChange }: Props) {
  const { control, setValue, watch } = useForm<FormValues>({
    defaultValues,
  });
  const values = watch();

  const fetchOptionOPDsWithQuery = async (page: number, search: string) => {
    try {
      const data = await useUnitKerjaSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: UnitKerjaSimpeg) => ({
          label: item.nama_unit_kerja,
          value: item.kode_unit_kerja,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };
  const fetchOPDByValue = async (value: string | number) => {
    try {
      const data = await useUnitKerjaSimpeg.fetcher({
        page: 1,
        limit: 20,
        search: String(value),
      });
      const found = data.data?.find(
        (item: UnitKerjaSimpeg) => item.kode_unit_kerja === value
      );
      return found
        ? { label: found.nama_unit_kerja, value: found.kode_unit_kerja }
        : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
  return (
    <View className="items-center rounded-b-3xl bg-[#20A0D8] px-4 pt-5">
      <View className="mb-4 flex-row items-center rounded-xl border border-gray-300 bg-gray-200 px-4 py-3 shadow-sm">
        <Search className="mr-3 size-5" color="black" strokeWidth={2.5} />
        <TextInput
          className="flex-1 text-base text-black"
          placeholder="Cari Nama Staff"
          placeholderTextColor="#6B7280"
          value={values.search}
          onChangeText={(text) => setValue('search', text)}
        />
      </View>

      <View className="mb-4 flex-row items-center rounded-xl">
        {/* Input Select */}
        <View className="flex-1">
          <Controller
            control={control}
            name="kode_opd"
            rules={{ required: 'OPD/UPT wajib dipilih' }}
            render={({ field: { value, onChange } }) => (
              <RemoteSelect
                value={value ?? ''}
                onSelect={(val) => onChange(val as string)}
                placeholder="Pilih OPD/UPT..."
                debounceMs={400}
                pageSize={10}
                fetchOptions={fetchOptionOPDsWithQuery}
                fetchOptionByValue={fetchOPDByValue}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
