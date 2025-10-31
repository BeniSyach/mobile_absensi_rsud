/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { Edit, Trash } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { queryClient, type RhkStaffChildItem } from '@/api';
import { DeleteRHKStaff } from '@/api/ekin/delete-rhk-staff/delete-rhk-staff';
import { AlertModal } from '@/components/title-second';
import { showErrorMessage, Text } from '@/components/ui';

interface CardProps {
  dataRHKItems: RhkStaffChildItem;
}

export default function CardHasilKerja({ dataRHKItems }: CardProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { mutateAsync: deleteRHK, isPending: isPosting } = DeleteRHKStaff({
    onSuccess: (res) => {
      showMessage({
        message: res.message,
        type: 'success',
        duration: 7000,
      });
    },
    onError: (e) => {
      showErrorMessage(e.message);
    },
  });

  const handleSetujuiHapus = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };
  const handleConfirm = async () => {
    setShowConfirmModal(false);
    await deleteRHK({
      id: Number(dataRHKItems.id_rhk_staff),
    });
    queryClient.invalidateQueries({ queryKey: ['getRhkStaffChild'] });
    queryClient.invalidateQueries({ queryKey: ['useRhkStaffChildInfinite'] });
  };
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };
  return (
    <View className=" m-2 rounded-xl border border-gray-200 bg-white p-4 shadow-md">
      {/* <Text className="mb-2 text-lg font-bold text-blue-700 ">
        PMr - Perawat Mahir
      </Text> */}

      <Text className="mb-1 text-lg font-bold text-gray-700">
        RENCANA HASIL KERJA
      </Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">
          {dataRHKItems?.uraian ?? '-'}
        </Text>
      </View>

      <Text className="mb-1 text-lg font-bold text-gray-700">INDIKATOR</Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">
          {dataRHKItems?.indikator ?? '-'}
        </Text>
      </View>

      <Text className="mb-1 text-lg font-bold text-gray-700">TARGET</Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">
          {dataRHKItems?.nilai ?? '-'}
        </Text>
      </View>

      <View className="flex-row justify-end gap-2">
        <Pressable
          className="flex-row items-center rounded bg-blue-600 px-4 py-1"
          onPress={() =>
            router.push({
              pathname: '/ekin/rencana-hasil-kerja/edit-rhk',
              params: {
                uraian: dataRHKItems?.uraian ?? null,
                indikator: dataRHKItems?.indikator ?? null,
                nilai: dataRHKItems?.nilai ?? null,
                id_rhk_pejabat: dataRHKItems?.id_rhk_pejabat ?? null,
                id: dataRHKItems?.id_rhk_staff ?? null,
                // id_satuan: dataRHKItems?.id_satuan ?? null,
              },
            })
          }
        >
          <Edit size={14} color="white" />
          <Text className="ml-2 text-sm text-white">Edit</Text>
        </Pressable>
        <Pressable
          className="flex-row items-center rounded bg-red-600 px-4 py-1"
          onPress={handleSetujuiHapus}
          disabled={isPosting}
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
