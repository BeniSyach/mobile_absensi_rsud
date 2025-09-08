/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { Edit, Trash } from 'lucide-react-native';
import React, { useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import { type DataItemRHKPejabat, queryClient } from '@/api';
import { DeleteRHKPejabat } from '@/api/ekin/rhk-pejabat/delete-rhk-pejabat';
import { AlertModal } from '@/components/title-second';
import { Pressable, showErrorMessage, Text, View } from '@/components/ui';

interface CardProps {
  dataRHKItems: DataItemRHKPejabat;
}

export default function CardHasilKerjaAtasan({ dataRHKItems }: CardProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { mutateAsync: deleteRHK, isPending: isPosting } = DeleteRHKPejabat();

  const handleSetujuiHapus = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };
  const handleConfirm = async () => {
    setShowConfirmModal(false);
    console.log('✅ Data disetujui secara final');

    try {
      const response = await deleteRHK({ id: dataRHKItems.id_rhk_pejabat });
      console.log('✅ Data berhasil dikirim:', response);
      queryClient.invalidateQueries({ queryKey: ['useRHKPejabatByNIK'] });
      showMessage({
        message: 'RHK berhasil dihapus.',
        type: 'success',
        duration: 7000,
      });
    } catch (error: any) {
      console.error('Error submitting EKIN:', error);

      let errorMessage = 'Terjadi kesalahan saat mengirim EKIN';

      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 413) {
          errorMessage = 'Ukuran data terlalu besar (Request Entity Too Large)';
        } else if (status === 422) {
          errorMessage =
            'Data tidak valid. Silakan periksa kembali input Anda.';
        } else if (status === 500) {
          errorMessage =
            'Terjadi kesalahan server. Silakan coba beberapa saat lagi.';
        }

        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.message) {
          errorMessage = data.messages;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showErrorMessage(errorMessage);
    }
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
          {dataRHKItems?.rhk_pejabat?.uraian ?? '-'}
        </Text>
      </View>

      <Text className="mb-1 text-lg font-bold text-gray-700">INDIKATOR</Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">
          {dataRHKItems?.rhk_pejabat?.indikator ?? '-'}
        </Text>
      </View>

      {/* <Text className="mb-1 text-lg font-bold text-gray-700">TARGET</Text>
      <View className="mb-3 rounded-md bg-gray-100 p-2">
        <Text className="text-base text-gray-800">
          {dataRHKItems.rhk_pejabat.nilai}
        </Text>
      </View> */}

      <View className="flex-row justify-end gap-2">
        <Pressable
          className="flex-row items-center rounded bg-blue-600 px-4 py-1"
          onPress={() =>
            router.push({
              pathname: '/ekin/rencana-hasil-kerja-atasan/edit-rhk',
              params: {
                uraian: dataRHKItems?.rhk_pejabat?.uraian ?? null,
                indikator: dataRHKItems?.rhk_pejabat?.indikator ?? null,
                id_rhk_pejabat: dataRHKItems?.id_rhk_pejabat ?? null,
                id: dataRHKItems?.id ?? null,
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
