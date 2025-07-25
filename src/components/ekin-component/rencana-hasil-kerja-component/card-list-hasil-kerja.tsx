import { useRouter } from 'expo-router';
import { Edit, Trash } from 'lucide-react-native';
import React, { useState } from 'react';

import { type Tagihan } from '@/api/bapenda';
import { AlertModal } from '@/components/title-second';
import { Pressable, Text, View } from '@/components/ui';

interface CardProps {
  dataTagihan: Tagihan;
}

export default function CardHasilKerja({ dataTagihan }: CardProps) {
  console.log(dataTagihan);
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
    <View className=" m-2 rounded-xl border border-gray-200 bg-white p-4 shadow-md">
      <Text className="mb-2 text-lg font-bold text-blue-700 ">
        PMr - Perawat Mahir
      </Text>

      <Text className="mb-1 text-lg font-bold text-gray-700">
        RENCANA HASIL KERJA
      </Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">
          Terlaksananya Tindakan pengkajian keperawatan pada pasien dengan
          intervensi pembedahan pada tahap pre/intra/post operasi
        </Text>
      </View>

      <Text className="mb-1 text-lg font-bold text-gray-700">INDIKATOR</Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">
          Jumlah pasien yang mendapat perencanaan diet sesuai penyakit dalam
          satu tahun
        </Text>
      </View>

      <Text className="mb-1 text-lg font-bold text-gray-700">TARGET</Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">100</Text>
      </View>

      <View className="flex-row justify-end gap-2">
        <Pressable
          className="flex-row items-center rounded bg-blue-600 px-4 py-1"
          onPress={() => router.push('/ekin/rencana-hasil-kerja/edit-rhk')}
        >
          <Edit size={14} color="white" />
          <Text className="ml-2 text-sm text-white">Edit</Text>
        </Pressable>
        <Pressable
          className="flex-row items-center rounded bg-red-600 px-4 py-1"
          onPress={handleSetujui}
        >
          <Trash size={14} color="white" />
          <Text className="ml-2 text-sm text-white">Hapus</Text>
        </Pressable>
      </View>
      <AlertModal
        visible={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </View>
  );
}
