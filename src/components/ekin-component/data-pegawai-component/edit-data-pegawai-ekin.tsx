/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import {
  type Eselon,
  type GolonganRuangSimpeg,
  type JabatanSimpeg,
  type PangkatSimpeg,
  type Pegawai,
  type UnitKerjaSimpeg,
  useGolonganRuangSimpeg,
  useJabatanSimpeg,
  usePangkatSimpeg,
  usePegawaiSimpeg,
  useUnitKerjaSimpeg,
} from '@/api';
import { useEselonSimpeg } from '@/api';
import { AlertModal } from '@/components/title-second';
import { Button, ControlledInput, ScrollView } from '@/components/ui';
import { RemoteSelect } from '@/components/ui/remote-select';

export interface DataProfileEdit {
  atasan: string;
  golongan: string;
  id: string;
  jabatan: string;
  kode_opd: string;
  nama: string;
  nik: string;
  nip: string;
  pangkat: string;
}

const schema = z.object({
  nama: z.string().min(1, 'nama wajib diisi'),
  nip: z.string().optional(),
  nik: z.string().min(1, 'NIK wajib diisi'),
  kode_opd: z.string().optional(),
  jabatan_id: z.string().optional(),
  pangkat_id: z.string().optional(),
  golongan_ruang_id: z.string().optional(),
  eselon_id: z.string().optional(),
  atasan: z.string().optional(),
});

export type FormType = z.infer<typeof schema>;

export interface EditDataPegawaiProps {
  onSubmit: SubmitHandler<FormType>;
  dataProfileEdit: DataProfileEdit;
  isPending: boolean;
}

export default function EditDataPegawaiEkin({
  onSubmit,
  dataProfileEdit,
  isPending,
}: EditDataPegawaiProps) {
  console.log('data profile', dataProfileEdit);
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (dataProfileEdit) {
      reset({
        nama: dataProfileEdit.nama || '',
        nip: dataProfileEdit.nip || '',
        nik: dataProfileEdit.nik || '',
        kode_opd: dataProfileEdit.kode_opd || '',
        jabatan_id: dataProfileEdit.jabatan || '',
        pangkat_id: dataProfileEdit.pangkat || '',
        golongan_ruang_id: dataProfileEdit.golongan || '',
        atasan: dataProfileEdit.atasan || '',
      });
    }
  }, [dataProfileEdit, reset]);

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

  const fetchOptionPangkatsWithQuery = async (page: number, search: string) => {
    try {
      const data = await usePangkatSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: PangkatSimpeg) => ({
          label: item.nama_pangkat,
          value: item.kode_pangkat,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionJabatansWithQuery = async (page: number, search: string) => {
    try {
      const data = await useJabatanSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: JabatanSimpeg) => ({
          label: item.nama_jabatan,
          value: item.kode_jabatan,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionEselonsWithQuery = async (page: number, search: string) => {
    try {
      const data = await useEselonSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: Eselon) => ({
          label: item.nama_eselon,
          value: item.kode_eselon,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionAtasansWithQuery = async (page: number, search: string) => {
    try {
      const data = await usePegawaiSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: Pegawai) => ({
          label: item.nama,
          value: item.nik,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionGolongansWithQuery = async (
    page: number,
    search: string
  ) => {
    try {
      const data = await useGolonganRuangSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: GolonganRuangSimpeg) => ({
          label: item.nama_golongan_ruang,
          value: item.kode_golongan_ruang,
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
    setShowConfirmModal(false); // tutup modal
  });

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };
  return (
    <ScrollView className="mx-5 mt-2 flex-1">
      <View className="bg-whites m-2 mt-7 rounded-2xl bg-transparent">
        <ControlledInput
          control={control}
          name="nama"
          label="Nama Lengkap"
          placeholder="Ketik Nama Lengkap Anda"
          error={errors.nama?.message}
        />
        <ControlledInput
          control={control}
          name="nip"
          label="NIP"
          placeholder="Ketik NIP Anda"
          keyboardType="number-pad"
          error={errors.nip?.message}
        />
        <ControlledInput
          control={control}
          name="nik"
          label="NIK"
          keyboardType="number-pad"
          placeholder="Ketik NIK Anda"
          error={errors.nik?.message}
        />
        <Controller
          control={control}
          name="kode_opd"
          render={({ field: { value, onChange } }) => (
            <RemoteSelect
              label="OPD/UPT"
              value={value}
              onSelect={(val) => onChange(val as string)}
              placeholder="Pilih OPD/UPT..."
              debounceMs={400}
              pageSize={10}
              fetchOptions={fetchOptionOPDsWithQuery}
            />
          )}
        />
        <Controller
          control={control}
          name="jabatan_id"
          render={({ field: { value, onChange } }) => (
            <RemoteSelect
              label="Jabatan"
              value={value}
              onSelect={(val) => onChange(val as string)}
              placeholder="Pilih Jabatan..."
              debounceMs={400}
              pageSize={10}
              fetchOptions={fetchOptionJabatansWithQuery}
            />
          )}
        />
        <Controller
          control={control}
          name="pangkat_id"
          render={({ field: { value, onChange } }) => (
            <RemoteSelect
              label="Pangkat"
              value={value}
              onSelect={(val) => onChange(val as string)}
              placeholder="Pilih Pangkat..."
              debounceMs={400}
              pageSize={10}
              fetchOptions={fetchOptionPangkatsWithQuery}
            />
          )}
        />
        <Controller
          control={control}
          name="golongan_ruang_id"
          render={({ field: { value, onChange } }) => (
            <RemoteSelect
              label="Golongan"
              value={value}
              onSelect={(val) => onChange(val as string)}
              placeholder="Pilih Golongan..."
              debounceMs={400}
              pageSize={10}
              fetchOptions={fetchOptionGolongansWithQuery}
            />
          )}
        />
        <Controller
          control={control}
          name="eselon_id"
          render={({ field: { value, onChange } }) => (
            <RemoteSelect
              label="Eselon"
              value={value}
              onSelect={(val) => onChange(val as string)}
              placeholder="Pilih Eselon..."
              debounceMs={400}
              pageSize={10}
              fetchOptions={fetchOptionEselonsWithQuery}
            />
          )}
        />
        <Controller
          control={control}
          name="atasan"
          render={({ field: { value, onChange } }) => (
            <RemoteSelect
              label="Atasan"
              value={value}
              onSelect={(val) => onChange(val as string)}
              placeholder="Pilih Atasan..."
              debounceMs={400}
              pageSize={10}
              fetchOptions={fetchOptionAtasansWithQuery}
            />
          )}
        />
        <View className="flex-row justify-start px-5 py-2">
          <Button
            label="Save"
            className="m-2 rounded-lg bg-[#C9DEFE] font-bold text-black"
            variant="secondary"
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
