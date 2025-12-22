/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import Stack from 'expo-router/build/layouts/Stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, ScrollView, StatusBar } from 'react-native';
import { z } from 'zod';

import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import {
  Button,
  ControlledInput,
  Image,
  SafeAreaView,
  Select,
  Text,
  View,
} from '@/components/ui';
import { DateInput } from '@/components/ui/date-input';

const schema = z.object({
  jenis_cuti: z.string().min(1, 'Jenis cuti wajib dipilih'),
  alasan_cuti: z.string().min(1, 'Alasan Cuti wajib diisi'),
  lama_cuti: z.string().min(1, 'Lama cuti wajib diisi'),
  satuan: z.string().min(1, 'Satuan wajib dipilih'),
  tanggal_mulai: z.string().min(1, 'Tanggal mulai wajib dipilih'),
  tanggal_selesai: z.string().min(1, 'Tanggal selesai wajib dipilih'),
  alamat_cuti: z.string().min(1, 'Alamat wajib diisi'),
  keterangan: z.string().min(1, 'Keterangan wajib diisi'),
  pertimbangan_atasan_langsung: z
    .string()
    .min(1, 'Pertimbangan Atasan Langsung wajib diisi'),
});

export type FormType = z.infer<typeof schema>;

export default function DetailPengajuanCuti() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormType | null>(null);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const Confirm = () => {
    setOpenConfirm(true);
  };

  const onSubmit = (data: FormType) => {
    setSubmittedData(data);
    console.log('data submit', submittedData);
    setOpenConfirm(false);
  };

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Detail Pengajuan Cuti',
          headerBackTitle: 'Detail Pengajuan Cuti',
          headerShown: false,
        }}
      />
      <CutiNavbar title="Detail Pengajuan Cuti" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
        <View className="items-center rounded-b-3xl bg-[#20A0D8] px-4 pt-1">
          <View className="w-full flex-row py-10"></View>
        </View>
        <View className="p-4">
          {/* HEADER */}
          <View className="pb-2">
            <Text className="text-lg font-bold">
              Detail Pengajuan Cuti Staff
            </Text>
          </View>

          {/* JENIS CUTI */}
          <Controller
            control={control}
            name="jenis_cuti"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Jenis Cuti"
                placeholder="Pilih Jenis Cuti..."
                value={value}
                onSelect={onChange}
                error={errors.jenis_cuti?.message}
                options={[
                  { label: 'Cuti Tahunan', value: 'tahunan' },
                  { label: 'Cuti Sakit', value: 'sakit' },
                  { label: 'Cuti Melahirkan', value: 'melahirkan' },
                ]}
              />
            )}
          />

          {/* ALASAN CUTI */}
          <ControlledInput
            label="Alasan Cuti"
            control={control}
            name="alasan_cuti"
            placeholder="Alasan Cuti"
            multiline
            numberOfLines={3}
            style={{ height: 70, textAlignVertical: 'top' }}
            error={errors.alasan_cuti?.message}
          />

          {/* LAMA CUTI */}
          <Text className="my-2 text-lg">Lamanya Cuti :</Text>
          <View className="flex-row flex-wrap items-center">
            <Text className="mr-2 w-20 text-lg font-semibold">Selama</Text>

            <View className="mr-2 w-20">
              <ControlledInput
                control={control}
                name="lama_cuti"
                keyboardType="number-pad"
                placeholder="0"
                error={errors.lama_cuti?.message}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={control}
                name="satuan"
                render={({ field: { value, onChange } }) => (
                  <Select
                    placeholder="Hari / Minggu / Bulan"
                    value={value}
                    onSelect={onChange}
                    options={[
                      { label: 'Hari', value: 'hari' },
                      { label: 'Minggu', value: 'minggu' },
                      { label: 'Bulan', value: 'bulan' },
                    ]}
                    error={errors.satuan?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* TANGGAL MULAI & SELESAI */}
          <View className="mt-4 flex-row items-center space-x-3">
            <View className="mx-1 flex-[0.4]">
              <DateInput
                label="Mulai Tanggal:"
                control={control}
                name="tanggal_mulai"
                placeholder="Pilih Tanggal"
                error={errors.tanggal_mulai?.message}
              />
            </View>

            <View className="mx-1 flex-[0.6]">
              <DateInput
                label="Sampai:"
                control={control}
                name="tanggal_selesai"
                placeholder="Pilih Tanggal"
                error={errors.tanggal_selesai?.message}
              />
            </View>
          </View>

          {/* ALAMAT CUTI */}
          <ControlledInput
            label="Alamat Selama Menjalankan Cuti"
            control={control}
            name="alamat_cuti"
            placeholder="Masukkan Alamat..."
            error={errors.alamat_cuti?.message}
            multiline
            numberOfLines={3}
            style={{ height: 70, textAlignVertical: 'top' }}
          />

          {/* Keterangan */}
          <ControlledInput
            label="Keterangan"
            control={control}
            name="keterangan"
            placeholder="Masukkan Keterangan..."
            error={errors.alamat_cuti?.message}
            multiline
            numberOfLines={3}
            style={{ height: 70, textAlignVertical: 'top' }}
          />

          {/* Pertimbangan Atasan langsung */}
          <Controller
            control={control}
            name="pertimbangan_atasan_langsung"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Pertimbangan Atasan Langsung"
                placeholder="Pilih..."
                value={value}
                onSelect={onChange}
                error={errors.jenis_cuti?.message}
                options={[
                  { label: 'Disetujui', value: 'Disetujui' },
                  { label: 'Perubahan', value: 'Perubahan' },
                  { label: 'Ditangguhkan', value: 'Ditangguhkan' },
                  { label: 'Tidak Disetujui', value: 'Tidak Disetujui' },
                ]}
              />
            )}
          />

          {/* SUBMIT */}
          <View className="mt-4 flex-row gap-3">
            <Button
              label="Ttd Pemohon (BsRe)"
              variant="outline"
              className="flex-[2] bg-[#20A0D8]"
              onPress={Confirm}
            />

            <Button
              label="Kembali"
              variant="outline"
              className="flex-[1] bg-gray-400"
              onPress={() => router.back()}
            />
          </View>

          {/* MODAL KONFIRMASI */}
          <Modal visible={openConfirm} animationType="fade" transparent>
            <View className="flex-1 items-center justify-center bg-black/50 px-4">
              <View className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
                <View className="mb-3 items-center">
                  <Image
                    source={require('../../../../../assets/gif/danger.gif')}
                    className="size-16"
                    contentFit="contain"
                  />
                </View>
                <Text className="mb-3 text-center text-lg font-bold text-gray-800">
                  Apakah Anda Yakin Simpan Data ini ?
                </Text>

                <View className="mt-4 flex-row gap-4">
                  <View className="flex-1">
                    <Button
                      label="Kirim"
                      className="w-full rounded-xl bg-[#20A0D8]"
                      onPress={handleSubmit(onSubmit)}
                    />
                  </View>

                  <View className="flex-1">
                    <Button
                      label="Batal"
                      variant="outline"
                      className="w-full rounded-xl border-gray-400"
                      onPress={() => setOpenConfirm(false)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
