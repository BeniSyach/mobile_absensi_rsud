/* eslint-disable max-lines-per-function */
import { Save } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';

import { AlertModal } from '@/components/title-second';
import { Button, Text, View } from '@/components/ui';

export default function FormTambahKegiatan() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleSetujui = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };
  const handleConfirm = () => {
    setShowConfirmModal(false);
    console.log('✅ Data disetujui secara final');
  };
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };
  return (
    <ScrollView className="flex-1">
      <View className="bg-whites m-2 mt-7 rounded-2xl bg-white">
        <View className="p-5">
          <Text className="mb-2 text-lg font-semibold text-black">
            Uraian Tugas
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Uraian Tugas"
          />
          <Text className="mb-2 text-lg font-semibold text-black">
            Lama Waktu
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Lama Waktu (menit)"
          />
          <Text className="mb-2 text-lg font-semibold text-black">
            Jumlah Capaian Kegiatan
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Jumlah Capaian Kegiatan"
          />
          <View className="flex-row justify-between">
            <View className="mr-1 flex-1">
              <Text className="mb-2 text-lg font-semibold text-black">
                Tanggal
              </Text>
              <TextInput className="mb-2 rounded-lg border p-2 py-4" />
            </View>
            <View className="mx-2 bg-white"></View>
            <View className="ml-1 flex-1">
              <Text className="mb-2 text-lg font-semibold text-black">Jam</Text>
              <TextInput className="mb-2 rounded-lg border p-2 py-4" />
            </View>
          </View>
          <Text className="mb-2 text-lg font-semibold text-black">
            Rencana Hasil Kerja
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Rencana Hasil Kerja"
          />
          <Text className="mb-2 text-lg font-semibold text-black">
            Indikator
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Indikator"
          />
        </View>
        <View className="flex-row justify-start px-5 py-2">
          <Button
            label="Save"
            className="m-2 rounded-lg bg-[#C9DEFE] font-bold text-black"
            variant="outline"
            icon={<Save size={20} color="black" />}
            onPress={handleSetujui}
          />
          <Button
            label="Batal"
            className="m-2 rounded-lg bg-[#C9DEFE] font-bold text-black"
            variant="secondary"
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
