/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';

import { AlertModal } from '@/components/title-second';
import {
  Button,
  DateInputOriginal,
  Select,
  Text,
  TimeInputOri,
  View,
} from '@/components/ui';

export default function FormTambahKegiatan() {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lamaWaktu, setLamaWaktu] = useState('');
  const [tanggal, setTanggal] = useState('');
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
          <View>
            <Text className="mb-2 text-lg font-semibold text-black">
              Lama Waktu
            </Text>
            <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
              <TextInput
                className="flex-1 p-2 text-black"
                placeholder="Lama waktu"
                keyboardType="number-pad"
              />
              <Text className="ml-2 text-gray-500">menit</Text>
            </View>
          </View>
          <Text className="mb-2 text-lg font-semibold text-black">
            Jumlah Capaian Kegiatan
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Jumlah Capaian Kegiatan"
            keyboardType="number-pad"
          />
          <View className="flex-row justify-between gap-2">
            <View className="mr-1 flex-1">
              <DateInputOriginal
                label="Tanggal"
                placeholder="Pilih tanggal"
                value={tanggal}
                onChange={setTanggal}
              />
            </View>
            <View className="ml-1 flex-1">
              <TimeInputOri
                label="Jam"
                placeholder="Pilih waktu (HH:MM)"
                value={lamaWaktu}
                onChange={setLamaWaktu}
              />
            </View>
          </View>
          <Select
            label="Rencana Hasil Kerja"
            placeholder="Pilih rencana hasil kerja"
            options={[]}
            onSelect={() => {}}
          />
          <Select
            label="Indikator"
            placeholder="Pilih Indikator"
            options={[]}
            onSelect={() => {}}
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
