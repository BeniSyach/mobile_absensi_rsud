/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import {
  type Eselon,
  type GolonganRuangSimpeg,
  type JabatanSimpeg,
  type PangkatSimpeg,
  type Pegawai,
  PutPegawai,
  type PutPegawaiVariables,
  queryClient,
  type UnitKerjaSimpeg,
  UpdateAtasanUser,
  type UpdateAtasanVariables,
  useGolonganRuangSimpeg,
  useJabatanSimpeg,
  usePangkatSimpeg,
  usePegawaiSimpeg,
  useUnitKerjaSimpeg,
} from '@/api';
import { useEselonSimpeg } from '@/api';
import { AlertModal } from '@/components/title-second';
import { Button, ScrollView, showErrorMessage, Text } from '@/components/ui';
import { RemoteSelect } from '@/components/ui/remote-select';

export interface DataProfileEdit {
  atasan: string;
  golongan: string;
  id: string;
  jabatan: string;
  kode_opd: string;
  nama: string;
  nik: string;
  nip: string;
  pangkat: string;
}

interface EditDataPegawaiProps {
  dataProfileEdit: DataProfileEdit;
}

export default function EditDataPegawaiEkin({
  dataProfileEdit,
}: EditDataPegawaiProps) {
  console.log('data profile', dataProfileEdit);
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nip, setNip] = useState('');
  const [nik, setNik] = useState('');
  const [opd, setOpd] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [pangkat, setPangkat] = useState('');
  const [golongan, setGolongan] = useState('');
  const [atasan, setAtasan] = useState('');
  const [eselon, setEselon] = useState('');

  const { mutateAsync: updateAtasan, isPending: isPosting } =
    UpdateAtasanUser();

  const { mutateAsync: updatePegawai, isPending: isPostingPegawai } =
    PutPegawai();

  useEffect(() => {
    if (dataProfileEdit?.nama) {
      setNamaLengkap(dataProfileEdit.nama);
      setNip(dataProfileEdit.nip);
      setNik(dataProfileEdit.nik);
      setOpd(dataProfileEdit.kode_opd);
      setJabatan(dataProfileEdit.jabatan);
      setPangkat(dataProfileEdit.pangkat);
      setGolongan(dataProfileEdit.golongan);
      setAtasan(dataProfileEdit.atasan);
    }
  }, [dataProfileEdit?.nama, dataProfileEdit?.nip, dataProfileEdit?.nik]);

  const fetchOptionOPDsWithQuery = async (page: number, search: string) => {
    try {
      const data = await useUnitKerjaSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: UnitKerjaSimpeg) => ({
          label: item.nama_unit_kerja,
          value: item.kode_unit_kerja,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionPangkatsWithQuery = async (page: number, search: string) => {
    try {
      const data = await usePangkatSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: PangkatSimpeg) => ({
          label: item.nama_pangkat,
          value: item.kode_pangkat,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionJabatansWithQuery = async (page: number, search: string) => {
    try {
      const data = await useJabatanSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: JabatanSimpeg) => ({
          label: item.nama_jabatan,
          value: item.kode_jabatan,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionEselonsWithQuery = async (page: number, search: string) => {
    try {
      const data = await useEselonSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: Eselon) => ({
          label: item.nama_eselon,
          value: item.kode_eselon,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionAtasansWithQuery = async (page: number, search: string) => {
    try {
      const data = await usePegawaiSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: Pegawai) => ({
          label: item.nama,
          value: item.nik,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching RHK staff:', error);
      return [];
    }
  };

  const fetchOptionGolongansWithQuery = async (
    page: number,
    search: string
  ) => {
    try {
      const data = await useGolonganRuangSimpeg.fetcher({
        page,
        limit: 20,
        search: search,
      });
      return (
        data.data?.map((item: GolonganRuangSimpeg) => ({
          label: item.nama_golongan_ruang,
          value: item.kode_golongan_ruang,
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

    const payload: UpdateAtasanVariables = {
      nik_user: dataProfileEdit?.nik ?? '',
      nik_atasan: atasan,
    };
    try {
      // 1️⃣ Update Atasan
      const responseAtasan = await updateAtasan(payload);
      console.log('✅ Data atasan berhasil dikirim:', responseAtasan);

      // 2️⃣ Jika sukses, lanjut update pegawai
      const payloadPegawai: PutPegawaiVariables = {
        nama: dataProfileEdit?.nama ?? '',
        nip: dataProfileEdit?.nip ?? '',
        pangkat_id: pangkat ?? '',
        golongan_ruang_id: golongan ?? '',
        jabatan_id: jabatan ?? '',
        eselon_id: eselon ?? '',
        nik: dataProfileEdit?.nik ?? '',
      };

      const responsePegawai = await updatePegawai(payloadPegawai);
      console.log('✅ Data pegawai berhasil dikirim:', responsePegawai);
      queryClient.invalidateQueries({ queryKey: ['UseProfileEkin'] });
      showMessage({
        message: 'Data Berhasil Di Edit.',
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
        } else if (data?.messages) {
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
    <ScrollView className="mx-5 mt-2 flex-1">
      <View className="bg-whites m-2 mt-7 rounded-2xl bg-transparent">
        <Text className="mb-2 text-lg font-semibold text-black">
          Nama Lengkap
        </Text>
        <TextInput
          className="mb-2 rounded-lg border p-2 py-4"
          placeholder="Nama Lengkap"
          value={namaLengkap}
          onChangeText={setNamaLengkap}
        />
        <Text className="mb-2 text-lg font-semibold text-black">NIP</Text>
        <TextInput
          className="mb-2 rounded-lg border p-2 py-4"
          placeholder="NIP"
          value={nip}
          onChangeText={setNip}
        />
        <Text className="mb-2 text-lg font-semibold text-black">NIK</Text>
        <TextInput
          className="mb-2 rounded-lg border p-2 py-4"
          placeholder="NIK"
          value={nik}
          onChangeText={setNik}
        />
        <RemoteSelect
          label="OPD/UPT"
          value={opd}
          onSelect={(val) => setOpd(val as string)}
          placeholder="Pilih OPD/UPT..."
          debounceMs={400}
          pageSize={10}
          fetchOptions={fetchOptionOPDsWithQuery}
        />
        <RemoteSelect
          label="Jabatan"
          value={jabatan}
          onSelect={(val) => setJabatan(val as string)}
          placeholder="Pilih Jabatan..."
          debounceMs={400}
          pageSize={10}
          fetchOptions={fetchOptionJabatansWithQuery}
        />
        <RemoteSelect
          label="Pangkat"
          value={pangkat}
          onSelect={(val) => setPangkat(val as string)}
          placeholder="Pilih Pangkat..."
          debounceMs={400}
          pageSize={10}
          fetchOptions={fetchOptionPangkatsWithQuery}
        />
        <RemoteSelect
          label="Golongan"
          value={golongan}
          onSelect={(val) => setGolongan(val as string)}
          placeholder="Pilih Golongan..."
          debounceMs={400}
          pageSize={10}
          fetchOptions={fetchOptionGolongansWithQuery}
        />
        <RemoteSelect
          label="Eselon"
          value={eselon}
          onSelect={(val) => setEselon(val as string)}
          placeholder="Pilih Eselon..."
          debounceMs={400}
          pageSize={10}
          fetchOptions={fetchOptionEselonsWithQuery}
        />
        <RemoteSelect
          label="Atasan"
          value={atasan}
          onSelect={(val) => setAtasan(val as string)}
          placeholder="Pilih Atasan..."
          debounceMs={400}
          pageSize={10}
          fetchOptions={fetchOptionAtasansWithQuery}
        />
        <View className="flex-row justify-start px-5 py-2">
          <Button
            label="Save"
            className="m-2 rounded-lg bg-[#C9DEFE] font-bold text-black"
            variant="secondary"
            icon={<Save size={20} color="black" />}
            onPress={handleSetujui}
            disabled={isPosting || isPostingPegawai}
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
