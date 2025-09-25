/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  GetRhkStaffChild,
  GetSatuanEkin,
  type RhkPejabatDataItem,
  type RhkStaffChildItem,
  type Satuan,
  useGetUser,
  useRhkPejabatChildByNik,
} from '@/api';
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
  id_rhk_pejabat: z.string().min(1, 'RHK Atasan wajib diisi'),
  indikator: z.string().min(1, 'Indikator wajib diisi'),
  uraian: z.string().min(1, 'Uraian wajib diisi'),
  id_satuan: z.number().min(1, 'Satuan wajib diisi'),
  nilai: z.string().min(1, 'Target wajib diisi'),
  tahun: z.string().min(1, 'Tahun wajib diisi'),
});

export type FormType = z.infer<typeof schema>;

export interface FormEditRHKProps {
  dataAtasan?: string | undefined;
  dataEdit: {
    id: number;
    uraian: string;
    indikator: string;
    nilai: number;
    id_rhk_pejabat: number;
  };
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

export default function FormEditRHK({
  dataAtasan,
  dataEdit,
  onSubmit,
  isPending,
}: FormEditRHKProps) {
  const { data: user } = useGetUser(dataAtasan ?? '');
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
  console.log('data error', errors);
  const isSekda =
    user?.data?.nama_eselon === 'II.a' || user?.data?.nama_eselon === 'II/a';
  const isKadis =
    user?.data?.nama_eselon === 'II.b' || user?.data?.nama_eselon === 'II/b';

  const fetchOptionOPDsWithQuery = async (page: number) => {
    try {
      if (isSekda || isKadis) {
        const data = await useRhkPejabatChildByNik.fetcher({
          page,
          limit: 20,
          nik: dataAtasan,
        });

        return (
          data.data?.map((item: RhkPejabatDataItem) => ({
            label: item.rhk_pejabat.uraian || '',
            value: item.id_rhk_pejabat,
          })) || []
        );
      } else {
        const data = await GetRhkStaffChild.fetcher({
          page,
          limit: 100,
          nik: dataAtasan,
        });

        return (
          data.data?.map((item: RhkStaffChildItem) => ({
            label: item.rhk_staff.uraian || '',
            value: item.id_rhk_staff,
          })) || []
        );
      }
    } catch (error) {
      console.error('Error fetching RHK:', error);
      return [];
    }
  };

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

  useEffect(() => {
    if (dataEdit?.id) {
      reset({
        id_rhk_pejabat: dataEdit.id_rhk_pejabat.toString() || '',
        uraian: dataEdit.uraian || '',
        nilai: dataEdit.nilai?.toString() || '',
        indikator: dataEdit.indikator || '',
        tahun: currentYear.toString(),
      });
    }
  }, [dataEdit, reset]);

  return (
    <ScrollView className="flex-1">
      <View className="bg-whites m-2 mt-7 rounded-2xl bg-white">
        <View className="p-5">
          <Controller
            control={control}
            name="id_rhk_pejabat"
            render={({ field: { value, onChange } }) => (
              <RemoteSelect
                label="Rencana Hasil Kerja Atasan"
                value={value}
                onSelect={(val) => onChange(val as number)}
                placeholder="Pilih Rencana Hasil Kerja Atasan..."
                debounceMs={400}
                pageSize={10}
                fetchOptions={fetchOptionOPDsWithQuery}
              />
            )}
          />
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
