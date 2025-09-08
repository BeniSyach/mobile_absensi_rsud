/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import {
  GetSatuanEkin,
  queryClient,
  type Satuan,
  type UpdateRHKPejabatPayload,
  type UserDataEkin,
} from '@/api';
import { PutRHKPejabat } from '@/api/ekin/rhk-pejabat/put-rhk-pejabat';
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
  data: UserDataEkin | undefined;
  dataEdit: {
    id: number;
    uraian: string;
    indikator: string;
    id_rhk_pejabat: number;
  };
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

export default function FormEditRHKAtasan({ data, dataEdit }: Props) {
  const router = useRouter();
  const storedMessage = getMessage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rhkStaff, setRhkStaff] = useState('');
  const [indikator, setindikator] = useState('');
  const [nilai, setNilai] = useState('');
  const [tahun, setTahun] = useState<string>(currentYear.toString());
  const { mutateAsync: putRHK, isPending: isPosting } = PutRHKPejabat();
  const [idSatuan, setIdSatuan] = useState<string>('');

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

    const payload: UpdateRHKPejabatPayload = {
      id: Number(dataEdit.id),
      kode_unit_kerja: storedMessage?.kode_unit_kerja ?? '',
      uraian: rhkStaff,
      kode_jabatan: data?.detail_pegawai.data.jabatan_id ?? '',
      kode_pangkat: data?.detail_pegawai.data.pangkat_id ?? '',
      indikator,
      nilai: Number(nilai),
      tahun: Number(tahun),
      id_satuan: Number(idSatuan),
    };

    try {
      const response = await putRHK(payload);
      console.log('✅ Data berhasil dikirim:', response);
      queryClient.invalidateQueries({ queryKey: ['useRHKPejabatByNIK'] });
      showMessage({
        message: 'RHK berhasil disimpan.',
        type: 'success',
        duration: 7000,
      });
      setRhkStaff('');
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

  useEffect(() => {
    if (dataEdit?.id) {
      setRhkStaff(dataEdit.uraian);
      setindikator(dataEdit.indikator);
    }
  }, [dataEdit?.id]);
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
            multiline
            textAlignVertical="top"
          />
          <Text className="mb-2 text-lg font-semibold text-black">Nilai</Text>
          <TextInput
            className="mb-2 rounded-lg border p-2 py-4"
            placeholder="Rencana Hasil Kerja"
            value={nilai}
            onChangeText={setNilai}
            keyboardType="number-pad"
          />

          <RemoteSelect
            label="Satuan"
            value={idSatuan}
            onSelect={(val) => setIdSatuan(val as string)}
            placeholder="Pilih Satuan..."
            debounceMs={400}
            pageSize={10}
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
