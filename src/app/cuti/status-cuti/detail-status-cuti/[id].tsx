/* eslint-disable max-lines-per-function */
import { Stack, useLocalSearchParams } from 'expo-router';
// import { useState } from 'react';
import { ScrollView, StatusBar } from 'react-native';

import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import {
  // Button,
  // Image,
  SafeAreaView,
  // Select,
  Text,
  View,
} from '@/components/ui';

export default function DetailStatusCuti() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const parsedData = data ? JSON.parse(data) : null;
  // const [openConfirm, setOpenConfirm] = useState(false);
  // const [openConfirmTolak, setOpenConfirmTolak] = useState(false);
  // const Confirm = () => {
  //   setOpenConfirm(true);
  // };
  // const ConfirmTolak = () => {
  //   setOpenConfirmTolak(true);
  // };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Detail Status Cuti',
          headerBackTitle: 'Detail Status Cuti',
          headerShown: false,
        }}
      />
      <CutiNavbar title="Detail Cuti" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
        <View className="items-center rounded-b-3xl bg-[#20A0D8] px-4 pt-1">
          <View className="w-full flex-row py-5"></View>
        </View>
        <View className="p-4">
          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="space-y-1">
              {/* Nama */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">Nama</Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.nama_pegawai}
                </Text>
              </View>

              {/* Jabatan */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Jabatan
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.nama_jabatan}
                </Text>
              </View>

              {/* Unit Kerja */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Unit Kerja
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.nama_unit_kerja}
                </Text>
              </View>

              {/* NIP */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">NIP</Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.nip ?? '-'}
                </Text>
              </View>

              {/* Golongan */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Golongan
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.nama_golongan_ruang}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="space-y-1">
              {/* Jenis Cuti */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Jenis Cuti
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.nama_jenis_cuti}
                </Text>
              </View>

              {/* Alasan Cuti */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Alasan Cuti
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.alasan}
                </Text>
              </View>

              {/* Lama Cuti */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Lama Cuti
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.lama_cuti} {parsedData.satuan_cuti}
                </Text>
              </View>

              {/* Tanggal Cuti */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Tanggal Cuti
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {formatDate(parsedData.tanggal_mulai)} s/d{' '}
                  {formatDate(parsedData.tanggal_selesai)}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="space-y-1">
              {/* Catatan Cuti */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Catatan Cuti
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.nama_jenis_cuti}
                </Text>
              </View>

              {/* Keterangan */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Keterangan
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.keterangan}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="space-y-2">
              {/* Alamat Cuti (stacked) */}
              <View>
                <Text className="mb-1 font-semibold text-gray-700">
                  Alamat Selama Menjalankan Cuti
                </Text>
                <Text className="flex-wrap text-gray-800">
                  {parsedData.alamat_cuti}
                </Text>
              </View>

              {/* Telp / HP */}
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Telp / HP
                </Text>
                <Text className="mr-1 text-gray-800">:</Text>
                <Text className="flex-1 flex-wrap text-gray-800">
                  {parsedData.no_hp ?? '-'}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            {/* Label */}
            <Text className="mb-2 font-semibold text-gray-700">
              Pertimbangan Atasan Langsung
            </Text>

            {/* Konten bebas */}
            <View className="w-full rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
              <Text className="text-gray-800">
                Saya menyetujui Permohonan Cuti atas nama{' '}
                <Text className="font-semibold">{parsedData.nama_pegawai}</Text>{' '}
                dan selama cuti tugas-tugas yang diemban beliau diserahkan
                kepada ...
              </Text>
            </View>
          </View>

          {/* <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <Text className="mb-3 text-base font-bold text-black">
              Keputusan Penjabat Yang Berwenang Memberikan Cuti
            </Text>

            <Select placeholder="Pilih keputusan" />
          </View> */}

          {/* SUBMIT
          <View className="mt-4 flex-row gap-3">
            <Button
              label="Ttd Pemohon (BsRe)"
              variant="outline"
              className="flex-[2] bg-[#20A0D8]"
              onPress={Confirm}
            />

            <Button
              label="Tolak"
              variant="outline"
              className="flex-[1] bg-red-700"
              onPress={ConfirmTolak}
            />
          </View> */}
        </View>
      </ScrollView>
      {/* <Modal visible={openConfirm} animationType="fade" transparent>
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
      <Modal visible={openConfirmTolak} animationType="fade" transparent>
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
              Apakah Anda Yakin Tolak Data ini ?
            </Text>

            <View className="mt-4 flex-row gap-4">
              <View className="flex-1">
                <Button
                  label="Tolak"
                  className="w-full rounded-xl bg-red-600"
                />
              </View>

              <View className="flex-1">
                <Button
                  label="Batal"
                  variant="outline"
                  className="w-full rounded-xl border-gray-400"
                  onPress={() => setOpenConfirmTolak(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
}
