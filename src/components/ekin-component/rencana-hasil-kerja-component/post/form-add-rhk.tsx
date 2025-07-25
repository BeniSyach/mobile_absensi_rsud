/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';

import { AlertModal } from '@/components/title-second';
import { Button, ScrollView, Select, Text, View } from '@/components/ui';

export default function FormAddRHK() {
  const router = useRouter();
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
          <Select
            label="Rencana Hasil Kerja Atasan"
            placeholder="Pilih rencana hasil kerja Atasan"
            options={[]}
            onSelect={() => {}}
          />
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
          <Text className="mb-2 text-lg font-semibold text-black">Target</Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Target"
            keyboardType="number-pad"
          />
          <Select
            label="Satuan"
            placeholder="Pilih Satuan"
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
