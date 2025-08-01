/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { type CreateRHKPejabatPayload, type UserDataEkin } from '@/api';
import { PostRHKPejabat } from '@/api/ekin/rhk-pejabat/post-rhk-pejabat';
import { AlertModal } from '@/components/title-second';
import {
  Button,
  ScrollView,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { getMessage } from '@/lib';

interface Props {
  data: UserDataEkin | undefined;
}

export default function FormAddRHKAtasan({ data }: Props) {
  const router = useRouter();
  const storedMessage = getMessage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rhkStaff, setRhkStaff] = useState('');
  const [indikator, setindikator] = useState('');

  const { mutateAsync: postRHK, isPending: isPosting } = PostRHKPejabat();

  const handleSetujui = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };
  const handleConfirm = async () => {
    setShowConfirmModal(false);
    console.log('✅ Data disetujui secara final');
    const payload: CreateRHKPejabatPayload = {
      kode_jabatan: data?.detail_pegawai?.data?.jabatan_id ?? '',
      kode_pangkat: data?.detail_pegawai?.data?.pangkat_id ?? '',
      kode_unit_kerja: storedMessage?.kode_unit_kerja ?? '',
      uraian: rhkStaff,
      nik: storedMessage?.nik ?? '',
      indikator,
    };

    try {
      const response = await postRHK(payload);
      console.log('✅ Data berhasil dikirim:', response);

      showMessage({
        message: 'RHK berhasil disimpan.',
        type: 'success',
        duration: 7000,
      });
      setRhkStaff('');
      setindikator('');
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
        } else if (data?.messages) {
          errorMessage = data.messages;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (error?.error) {
        errorMessage = error.error;
      }

      showErrorMessage(errorMessage);
    }
  };
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };
  return (
    <ScrollView className="flex-1">
      <View className="bg-whites m-2 mt-7 rounded-2xl bg-white">
        <View className="p-5">
          <Text className="mb-2 text-lg font-semibold text-black">
            Rencana Hasil Kerja
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Rencana Hasil Kerja"
            value={rhkStaff}
            onChangeText={setRhkStaff}
          />

          <Text className="mb-2 text-lg font-semibold text-black">
            Indikator
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Rencana Hasil Kerja"
            value={indikator}
            onChangeText={setindikator}
          />
        </View>
        <View className="flex-row justify-start px-5 py-2">
          <Button
            label="Save"
            className="m-2 rounded-lg bg-[#C9DEFE] font-bold text-black"
            variant="outline"
            icon={<Save size={20} color="black" />}
            onPress={handleSetujui}
            disabled={isPosting}
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
