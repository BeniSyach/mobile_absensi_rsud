/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { GetSatuanEkin, type Satuan } from '@/api';
import { AlertModal } from '@/components/title-second';
import {
  Button,
  ControlledInput,
  type OptionType,
  ScrollView,
  Select,
  View,
} from '@/components/ui';
import { RemoteSelect } from '@/components/ui/remote-select';

const schema = z.object({
  indikator: z.string().min(1, 'Indikator wajib diisi'),
  uraian: z.string().min(1, 'Uraian wajib diisi'),
  id_satuan: z.number().min(1, 'Satuan wajib diisi'),
  nilai: z.string().min(1, 'Target wajib diisi'),
  tahun: z.string().min(1, 'Tahun wajib diisi'),
});

export type FormType = z.infer<typeof schema>;

export interface FormAddRHKPejabatProps {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
}

const currentYear = new Date().getFullYear();

// Buat array tahun dari -3 sampai +3 dari tahun sekarang
const tahunOptions: OptionType[] = Array.from({ length: 7 }, (_, i) => {
  const year = currentYear - 3 + i;
  return {
    label: year.toString(),
    value: year.toString(),
  };
});

export default function FormAddRHKAtasan({
  onSubmit,
  isPending,
}: FormAddRHKPejabatProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tahun, setTahun] = useState<string>(currentYear.toString());

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      tahun: currentYear.toString(), // langsung set default
    },
  });

  const fetchOptionSatuansWithQuery = async (page: number, search: string) => {
    try {
      const data = await GetSatuanEkin.fetcher({
        page,
        limit: 20,
        search: search || undefined,
      });
      return (
        data.data?.map((item: Satuan) => ({
          label: item.satuan || '',
          value: item.id,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const handleSetujui = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };

  const handleConfirm = handleSubmit((data) => {
    onSubmit(data); // proses submit data
    reset();
    setShowConfirmModal(false); // tutup modal
  });

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };
  return (
    <ScrollView className="flex-1">
      <View className="bg-whites m-2 mt-7 rounded-2xl bg-white">
        <View className="p-5">
          <ControlledInput
            control={control}
            name="uraian"
            label="Rencana Hasil Kerja"
            placeholder="Rencana Hasil Kerja"
            error={errors.uraian?.message}
          />

          <ControlledInput
            control={control}
            name="indikator"
            label="Indikator"
            placeholder="Indikator"
            error={errors.indikator?.message}
          />

          <ControlledInput
            control={control}
            name="nilai"
            label="Target"
            placeholder="Target"
            error={errors.nilai?.message}
          />
          <Controller
            control={control}
            name="id_satuan"
            render={({ field: { value, onChange } }) => (
              <RemoteSelect
                label="Satuan"
                value={value}
                onSelect={(val) => onChange(val as string)}
                placeholder="Pilih Satuan..."
                debounceMs={400}
                pageSize={10}
                fetchOptions={fetchOptionSatuansWithQuery}
              />
            )}
          />
          <Select
            label="Tahun"
            placeholder="Pilih Tahun"
            options={tahunOptions}
            value={tahun}
            onSelect={(val) => {
              setTahun(val as string); // update state lokal
              setValue('tahun', String(val)); // update react-hook-form
            }}
            error={errors.tahun?.message}
          />
        </View>
        <View className="flex-row justify-start px-5 py-2">
          <Button
            label="Save"
            className="m-2 rounded-lg bg-[#C9DEFE] font-bold text-black"
            variant="outline"
            icon={<Save size={20} color="black" />}
            onPress={handleSetujui}
            disabled={isPending}
          />
          <Button
            label="Batal"
            className="m-2 rounded-lg bg-[#C9DEFE] font-bold text-black"
            variant="secondary"
            onPress={() => router.back()}
            icon={<ArrowLeft size={20} color="black" />}
          />
        </View>
      </View>
      <AlertModal
        visible={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </ScrollView>
  );
}
