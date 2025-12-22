/* eslint-disable max-lines-per-function */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StatusBar } from 'react-native';

import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';
import { Button, Image, SafeAreaView, Text, View } from '@/components/ui';

export default function DetailStatusCuti() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const Confirm = () => {
    setOpenConfirm(true);
  };
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
            <View className="mb-2">
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">Nama</Text>
                <Text className="text-gray-800">: {id}</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Jabatan
                </Text>
                <Text className="text-gray-800">: Staff</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Unit Kerja
                </Text>
                <Text className="text-gray-800">: Dinas...</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">NIP</Text>
                <Text className="text-gray-800">: 19.....</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Golongan
                </Text>
                <Text className="text-gray-800">: III</Text>
              </View>
            </View>
          </View>
          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="mb-2">
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Jenis Cuti
                </Text>
                <Text className="text-gray-800">: Tahunan</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Alasan Cuti
                </Text>
                <Text className="text-gray-800">: Melaksanakan Umroh</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Lama Cuti
                </Text>
                <Text className="text-gray-800">: 12 hari</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Tanggal Cuti
                </Text>
                <Text className="text-gray-800">
                  : 04 Nov 2025 s/d 17 Nov 2025
                </Text>
              </View>
            </View>
          </View>
          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="mb-2">
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Catatan Cuti
                </Text>
                <Text className="text-gray-800">: Cuti Tahunan</Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Keterangan
                </Text>
                <Text className="text-gray-800">
                  : Sisa Cuti Ybs tahun 2025, 12 hari terakhir mengambil cuti 30
                  juli 2024{' '}
                </Text>
              </View>
            </View>
          </View>
          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="mb-2">
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Alamat Selama Menjalankan Cuti
                </Text>
                <Text className="text-gray-800">: </Text>
              </View>
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Telp/Hp
                </Text>
                <Text className="text-gray-800">
                  : 1234567898012 Arab Saudi
                </Text>
              </View>
            </View>
          </View>
          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <View className="mb-2">
              <View className="flex-row">
                <Text className="w-28 font-semibold text-gray-700">
                  Pertimbangan Atasan Langsung
                </Text>
                <Text className="text-gray-800">: Saya menyetujui ....</Text>
              </View>
            </View>
          </View>
          <View className="mb-2 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow">
            <Text className=" font-semibold text-gray-700">
              Keputusan Penjabat Yang Berwenang Memberikan Cuti :
            </Text>
          </View>
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
        </View>
      </ScrollView>
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
    </SafeAreaView>
  );
}
