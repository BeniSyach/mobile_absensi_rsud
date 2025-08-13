/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import {
  GetRhkStaffChild,
  GetSatuanEkin,
  PostRHKStaff,
  type PostRhkStaffVariables,
  type RhkPejabatItem,
  type RhkStaffChildItem,
  type Satuan,
  useGetUser,
  useRhkPejabatChildByNik,
} from '@/api';
import { AlertModal } from '@/components/title-second';
import {
  Button,
  type OptionType,
  ScrollView,
  Select,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { RemoteSelect } from '@/components/ui/remote-select';
import { getMessage } from '@/lib';

interface Props {
  dataAtasan: string;
}

const currentYear = new Date().getFullYear();

// Buat array tahun dari -3 sampai +3 dari tahun sekarang
const tahunOptions: OptionType[] = Array.from({ length: 7 }, (_, i) => {
  const year = currentYear - 3 + i;
  return {
    label: year.toString(),
    value: year.toString(),
  };
});

export default function FormAddRHK({ dataAtasan }: Props) {
  const { data: user } = useGetUser(dataAtasan ?? '');
  const router = useRouter();
  const storedMessage = getMessage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rhk_atasan, setRhkAtasan] = useState('');
  const [satuan, setSatuan] = useState('');
  const [rhkStaff, setRhkStaff] = useState('');
  const [indikator, setIndikator] = useState('');
  const [target, setTarget] = useState('');
  const [tahun, setTahun] = useState<string>(currentYear.toString());
  const { mutateAsync: postRHK, isPending: isPosting } = PostRHKStaff();

  const isSekda =
    user?.data?.nama_eselon === 'II.a' || user?.data?.nama_eselon === 'II/a';
  const isKadis =
    user?.data?.nama_eselon === 'II.b' || user?.data?.nama_eselon === 'II/b';

  const fetchOptionRHKsWithQuery = async (page: number) => {
    try {
      if (isSekda || isKadis) {
        const data = await useRhkPejabatChildByNik.fetcher({
          page,
          limit: 20,
          nik: dataAtasan,
        });

        return (
          data.data?.map((item: RhkPejabatItem) => ({
            label: item.rhk_pejabat.uraian || '',
            value: item.id_rhk_pejabat,
          })) || []
        );
      } else {
        const data = await GetRhkStaffChild.fetcher({
          page,
          limit: 20,
          nik: dataAtasan,
        });

        return (
          data.data?.map((item: RhkStaffChildItem) => ({
            label: item.rhk_staff.uraian || '',
            value: item.id_rhk_staff,
          })) || []
        );
      }
    } catch (error) {
      console.error('Error fetching RHK:', error);
      return [];
    }
  };

  const fetchOptionSatuansWithQuery = async (page: number, search: string) => {
    try {
      const data = await GetSatuanEkin.fetcher({
        page,
        limit: 20,
        search: search || undefined,
      });
      return (
        data.data?.map((item: Satuan) => ({
          label: item.satuan || '',
          value: item.id,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const handleSetujui = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };
  const handleConfirm = async () => {
    setShowConfirmModal(false);
    console.log('✅ Data disetujui secara final');
    const payload: PostRhkStaffVariables = {
      id_rhk_pejabat: Number(rhk_atasan),
      nik: storedMessage?.nik ?? '',
      kode_unit_kerja: storedMessage?.kode_unit_kerja ?? '',
      indikator: indikator,
      uraian: rhkStaff,
      nilai: Number(target),
      tahun: Number(tahun),
      id_satuan: Number(satuan),
    };

    try {
      const response = await postRHK(payload);
      console.log('✅ Data berhasil dikirim:', response);

      showMessage({
        message: 'RHK berhasil disimpan.',
        type: 'success',
        duration: 7000,
      });
      setRhkAtasan('');
      setSatuan('');
      setRhkStaff('');
      setIndikator('');
      setTarget('');
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
          <RemoteSelect
            label="Rencana Hasil Kerja Atasan"
            value={rhk_atasan}
            onSelect={(val) => setRhkAtasan(val as string)}
            placeholder="Pilih Rencana Hasil Kerja Atasan..."
            debounceMs={400}
            fetchOptions={fetchOptionRHKsWithQuery}
          />
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
            placeholder="Indikator"
            value={indikator}
            onChangeText={setIndikator}
          />
          <Text className="mb-2 text-lg font-semibold text-black">Target</Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Target"
            keyboardType="number-pad"
            value={target}
            onChangeText={setTarget}
          />
          <RemoteSelect
            label="Satuan"
            value={satuan}
            onSelect={(val) => setSatuan(val as string)}
            placeholder="Pilih Satuan..."
            debounceMs={400}
            fetchOptions={fetchOptionSatuansWithQuery}
          />
          <Select
            label="Tahun"
            placeholder="Pilih Tahun"
            options={tahunOptions}
            value={tahun}
            onSelect={(value) => setTahun(String(value))}
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
