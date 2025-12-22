/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { queryClient } from '@/api';
import { type PostCutiPayload } from '@/api/cuti';
import { PostCutiPegawai } from '@/api/cuti/post-cuti-pegawai';
import { useInfiniteJenisCutiPegawai } from '@/api/cuti/use-jenis-cuti';
import {
  Button,
  ControlledInput,
  Image,
  Select,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { DateInput } from '@/components/ui/date-input';
import { getMessage } from '@/lib';

const schema = z.object({
  jenis_cuti: z.string().min(1, 'Jenis cuti wajib dipilih'),
  alasan_cuti: z.string().min(1, 'Alasan Cuti wajib diisi'),
  lama_cuti: z.string().min(1, 'Lama cuti wajib diisi'),
  satuan: z.string().min(1, 'Satuan wajib dipilih'),
  tanggal_mulai: z.string().min(1, 'Tanggal mulai wajib dipilih'),
  tanggal_selesai: z.string().min(1, 'Tanggal selesai wajib dipilih'),
  alamat_cuti: z.string().min(1, 'Alamat wajib diisi'),
});

export type FormType = z.infer<typeof schema>;

export default function FormAjukanCuti() {
  const storedMessage = getMessage();
  const [openConfirm, setOpenConfirm] = useState(false);
  const { mutateAsync: postCuti, isPending } = PostCutiPegawai({
    onSuccess: (res) => {
      showMessage({
        message: res.message,
        type: 'success',
        duration: 7000,
      });
    },
    onError: (e: any) => {
      showErrorMessage(e.error);
    },
  });
  const { data, isLoading, isError } = useInfiniteJenisCutiPegawai({
    limit: 20,
  });

  const jenisCutiOptions =
    data?.pages
      .flatMap((page) => page.data)
      .map((item) => ({
        label: item.nama_jenis_cuti,
        value: item.kode, // biasanya kirim kode ke backend
      })) ?? [];

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

  const onSubmit = async (form: FormType) => {
    try {
      const payload: PostCutiPayload = {
        nik: storedMessage?.nik ?? '',
        kode_unit_kerja: storedMessage?.kode_unit_kerja ?? '',
        kode_jenis_cuti: form.jenis_cuti,
        lama_cuti: Number(form.lama_cuti),
        satuan_cuti: form.satuan,
        tanggal_mulai: form.tanggal_mulai,
        tanggal_selesai: form.tanggal_selesai,
        tanggal_pengajuan: new Date().toISOString().split('T')[0],
        alasan: form.alasan_cuti,
        alamat_cuti: form.alamat_cuti,
        status: 0, // pending
      };

      await postCuti(payload);

      setOpenConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['useCheckSaldoCuti'] });
      queryClient.invalidateQueries({
        queryKey: ['useGetDashboardCuti'],
      });
      queryClient.invalidateQueries({ queryKey: ['useInfiniteCutiPegawai'] });
    } catch (error) {
      console.error('❌ Gagal simpan cuti:', error);
    }
  };

  return (
    <View className="p-4">
      {/* HEADER */}
      <View className="pb-2">
        <Text className="text-lg font-bold">
          Formulir Permintaan dan Pemberian Cuti
        </Text>
        <Text className="text-sm">
          Harap berikan informasi tentang cuti anda
        </Text>
      </View>

      {/* JENIS CUTI */}
      <Controller
        control={control}
        name="jenis_cuti"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Jenis Cuti"
            placeholder={
              isLoading ? 'Memuat jenis cuti...' : 'Pilih Jenis Cuti...'
            }
            value={value}
            onSelect={onChange}
            error={errors.jenis_cuti?.message}
            options={jenisCutiOptions}
            disabled={isLoading || isError}
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

      {/* SUBMIT */}
      <Button
        label="Tanda Tangan Pemohon (BsRe)"
        variant="outline"
        className="mt-4 bg-[#20A0D8]"
        size="lg"
        disabled={isPending}
        onPress={Confirm}
      />

      {/* MODAL KONFIRMASI */}
      <Modal visible={openConfirm} animationType="fade" transparent>
        <View className="flex-1 items-center justify-center bg-black/50 px-4">
          <View className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <View className="mb-3 items-center">
              <Image
                source={require('../../../../assets/gif/danger.gif')}
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
  );
}
