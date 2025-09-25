/* eslint-disable max-lines-per-function */
import 'dayjs/locale/id';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, TextInput } from 'react-native';
import { z } from 'zod';

import {
  GetSatuanEkin,
  type RhkPejabatDataItem,
  type Satuan,
  useRhkPejabatChildByNik,
  type UserPegawai,
} from '@/api';
import { AlertPostModal } from '@/components/title-second';
import {
  Button,
  ControlledInput,
  DateInputOriginal,
  Text,
  TimeInputOri,
  View,
} from '@/components/ui';
import { RemoteSelect } from '@/components/ui/remote-select';
dayjs.extend(customParseFormat);
dayjs.locale('id');

const schema = z.object({
  uraian_tugas: z.string().min(1, 'Uraian tugas wajib diisi'),
  lamaWaktu: z.string().min(1, 'Lama waktu wajib diisi'),
  jumlah_capaian: z.string().min(1, 'Jumlah capaian wajib diisi'),
  satuan: z.number().min(1, 'Satuan wajib dipilih'),
  tanggal: z.string().min(1, 'Tanggal wajib dipilih'),
  waktu_tanggal: z.string().min(1, 'Jam wajib dipilih'),
  selectedrhk: z.number().min(1, 'RHK wajib dipilih'),
  selectedIndikator: z.string().optional(),
});

export type FormType = z.infer<typeof schema>;
export interface FormAddKegiatanPejabatProps {
  dataUserLogin: UserPegawai | null;
  isPending: boolean;
  onSubmit: SubmitHandler<FormType>;
}

export default function FormTambahKegiatanPejabat({
  dataUserLogin,
  isPending,
  onSubmit,
}: FormAddKegiatanPejabatProps) {
  // const storedMessage = getMessage();
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [rhkMap, setRhkMap] = useState<Record<string, RhkPejabatDataItem>>({});

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm<FormType>({ resolver: zodResolver(schema) });

  const selectedrhk = watch('selectedrhk');

  const fetchOptionRHKsWithQuery = async (page: number, search: string) => {
    try {
      const data = await useRhkPejabatChildByNik.fetcher({
        page,
        limit: 20,
        search: search || undefined,
        nik: dataUserLogin?.nik ?? '',
      });
      const newMap: Record<string, RhkPejabatDataItem> = {};
      data.data?.forEach((item: RhkPejabatDataItem) => {
        newMap[item.id_rhk_pejabat] = item;
      });
      setRhkMap((prev) => ({ ...prev, ...newMap }));
      return (
        data.data?.map((item: RhkPejabatDataItem) => ({
          label: item.rhk_pejabat.uraian || '',
          value: item.id_rhk_pejabat,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
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

  // Saat selectedrhk berubah, update selectedIndikator
  useEffect(() => {
    if (selectedrhk && rhkMap[selectedrhk]) {
      const indikatorText = rhkMap[selectedrhk]?.rhk_pejabat?.indikator ?? '';
      setValue('selectedIndikator', indikatorText);
    } else {
      setValue('selectedIndikator', '');
    }
  }, [selectedrhk, rhkMap, setValue]);

  return (
    <ScrollView className="flex-1">
      <View className="bg-whites m-2 mt-7 rounded-2xl bg-white">
        <View className="p-5">
          <ControlledInput
            control={control}
            name="uraian_tugas"
            label="Uraian Tugas"
            placeholder="Ketik Uraian Tugas Anda"
            error={errors.uraian_tugas?.message}
          />

          <Text className="mb-2 text-lg font-semibold text-black">
            Lama Waktu
          </Text>
          <Controller
            control={control}
            name="lamaWaktu"
            render={({ field: { value, onChange } }) => (
              <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
                <TextInput
                  className="flex-1 p-2 text-black"
                  placeholder="Lama waktu"
                  keyboardType="number-pad"
                  onChangeText={onChange}
                  value={value}
                />
                <Text className="ml-2 text-gray-500">menit</Text>
              </View>
            )}
          />

          <ControlledInput
            control={control}
            name="jumlah_capaian"
            label="Jumlah Capaian Kegiatan"
            placeholder="Ketik Uraian Tugas Anda"
            keyboardType="number-pad"
            error={errors.uraian_tugas?.message}
          />

          <Controller
            control={control}
            name="satuan"
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

          <View className="flex-row justify-between gap-2">
            <View className="mr-1 flex-1">
              <Controller
                control={control}
                name="tanggal"
                render={({ field: { value, onChange } }) => (
                  <DateInputOriginal
                    label="Tanggal"
                    placeholder="Pilih tanggal"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
            <View className="ml-1 flex-1">
              <Controller
                control={control}
                name="waktu_tanggal"
                render={({ field: { value, onChange } }) => (
                  <TimeInputOri
                    label="Jam"
                    placeholder="Pilih waktu (HH:MM)"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="selectedrhk"
            render={({ field: { value, onChange } }) => (
              <RemoteSelect
                label="Rencana Hasil Kerja"
                value={value}
                onSelect={(val) => onChange(val as string)}
                placeholder="Pilih RHK..."
                debounceMs={400}
                pageSize={10}
                fetchOptions={fetchOptionRHKsWithQuery}
              />
            )}
          />

          <Text className="mb-2 text-lg font-semibold text-black">
            Indikator
          </Text>
          <Controller
            control={control}
            name="selectedIndikator"
            render={({ field: { value } }) => (
              <TextInput
                className="mb-2 rounded-lg border p-2"
                placeholder="Indikator"
                value={value}
                editable={false}
                multiline
                textAlignVertical="top"
              />
            )}
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
      <AlertPostModal
        visible={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </ScrollView>
  );
}
