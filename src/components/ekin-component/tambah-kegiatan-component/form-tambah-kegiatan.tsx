/* eslint-disable max-lines-per-function */
import 'dayjs/locale/id';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import {
  GetRhkStaffChild,
  GetSatuanEkin,
  PostKegiatanHarian,
  type PostKegiatanHarianVariables,
  queryClient,
  type RhkStaffChildItem,
  type Satuan,
  type UserPegawai,
} from '@/api';
import { AlertPostModal } from '@/components/title-second';
import {
  Button,
  DateInputOriginal,
  showErrorMessage,
  Text,
  TimeInputOri,
  View,
} from '@/components/ui';
import { RemoteSelect } from '@/components/ui/remote-select';
dayjs.extend(customParseFormat);
dayjs.locale('id');

interface Props {
  dataUserLogin: UserPegawai | null;
}

export default function FormTambahKegiatan({ dataUserLogin }: Props) {
  // const storedMessage = getMessage();
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lamaWaktu, setLamaWaktu] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [waktu_tanggal, setWaktuTanggal] = useState('');
  const [selectedrhk, setSelectedrhk] = useState('');
  const [selectedIndikator, setSelectedIndikator] = useState('');
  const [satuan, setSatuan] = useState('');
  const [uraian_tugas, setUraianTugas] = useState('');
  const [jumlah_capaian, setJumlahCapaian] = useState('');
  const [rhkMap, setRhkMap] = useState<Record<string, RhkStaffChildItem>>({});

  const { mutateAsync: postKegiatan, isPending: isPosting } =
    PostKegiatanHarian();

  const fetchOptionRHKsWithQuery = async (page: number, search: string) => {
    try {
      console.log('API Call - Page:', page, 'Search:', search); // Debug log
      const data = await GetRhkStaffChild.fetcher({
        page,
        limit: 20, // Sesuaikan dengan pageSize di RemoteSelect
        search: search || undefined,
        nik: dataUserLogin?.nik ?? '',
      });

      console.log('API Response:', data.data?.length, 'items'); // Debug log

      const newMap: Record<string, RhkStaffChildItem> = {};
      data.data?.forEach((item: RhkStaffChildItem) => {
        newMap[item.id_rhk_staff] = item;
      });
      setRhkMap((prev) => ({ ...prev, ...newMap }));

      return (
        data.data?.map((item: RhkStaffChildItem) => ({
          label: item.rhk_staff.uraian || '',
          value: item.id_rhk_staff,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  // const fetchOptionIndikatorsWithQuery = async (
  //   page: number,
  //   search: string
  // ) => {
  //   try {
  //     const data = await GetIndikatorByUnitKerja.fetcher({
  //       page,
  //       limit: 20,
  //       search: search || undefined,
  //       kode_unit_kerja: storedMessage?.kode_unit_kerja || '1',
  //     });
  //     return (
  //       data.data?.map((item: Indikator) => ({
  //         label: item.uraian || '',
  //         value: item.id,
  //       })) || []
  //     );
  //   } catch (error) {
  //     console.error('Error fetching RHK staff:', error);
  //     return [];
  //   }
  // };

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

    // const tgl_kinerja = `${tanggal}T${waktu_tanggal}:00`;

    const tgl_kinerja = dayjs(
      `${tanggal} ${waktu_tanggal}`,
      'DD MMMM YYYY HH:mm'
    ).format('YYYY-MM-DDTHH:mm:ss');

    const payload: PostKegiatanHarianVariables = {
      waktu_kinerja: lamaWaktu,
      tgl_kinerja: tgl_kinerja,
      id_rhkstaff: selectedrhk,
      indikator: selectedIndikator,
      id_satuan: satuan,
      uraian_tugas,
      nik: dataUserLogin?.nik ?? '',
      nilai: Number(jumlah_capaian),
      status: 0,
    };

    try {
      const response = await postKegiatan(payload);
      console.log('✅ Data berhasil dikirim:', response);
      queryClient.invalidateQueries({ queryKey: ['getKegiatanHarianByUser'] });
      showMessage({
        message: 'Kegiatan harian berhasil disimpan.',
        type: 'success',
        duration: 7000,
      });
      setTanggal('');
      setWaktuTanggal('');
      setLamaWaktu('');
      setSelectedrhk('');
      setSelectedIndikator('');
      setSatuan('');
      setLamaWaktu('');
      setUraianTugas('');
      setJumlahCapaian('');
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

  // Saat selectedrhk berubah, update selectedIndikator
  useEffect(() => {
    if (selectedrhk && rhkMap[selectedrhk]) {
      const indikatorText = rhkMap[selectedrhk]?.rhk_staff?.indikator;
      setSelectedIndikator(indikatorText);
    } else {
      setSelectedIndikator('');
    }
  }, [selectedrhk, rhkMap]);
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
            onChangeText={setUraianTugas}
            value={uraian_tugas}
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
                onChangeText={setLamaWaktu}
                value={lamaWaktu}
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
            onChangeText={setJumlahCapaian}
            value={jumlah_capaian}
          />
          <RemoteSelect
            label="Satuan"
            value={satuan}
            onSelect={(val) => setSatuan(val as string)}
            placeholder="Pilih Satuan..."
            debounceMs={400}
            pageSize={10}
            fetchOptions={fetchOptionSatuansWithQuery}
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
                value={waktu_tanggal}
                onChange={setWaktuTanggal}
              />
            </View>
          </View>
          <RemoteSelect
            label="Rencana Hasil Kerja"
            value={selectedrhk}
            onSelect={(val) => setSelectedrhk(val as string)}
            placeholder="Pilih RHK..."
            debounceMs={400}
            pageSize={10}
            fetchOptions={fetchOptionRHKsWithQuery}
          />
          {/* <RemoteSelect
            label="Indikator"
            value={selectedIndikator}
            onSelect={(val) => setSelectedIndikator(val as string)}
            placeholder="Pilih Indikator..."
            debounceMs={400} // Bisa disesuaikan
            fetchOptions={fetchOptionIndikatorsWithQuery}
          /> */}
          <Text className="mb-2 text-lg font-semibold text-black">
            Indikator
          </Text>
          <TextInput
            className="mb-2 rounded-lg border p-2"
            placeholder="Indikator"
            onChangeText={setSelectedIndikator}
            value={selectedIndikator}
            editable={false}
            multiline
            textAlignVertical="top" // biar rapih di atas
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
      <AlertPostModal
        visible={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </ScrollView>
  );
}
