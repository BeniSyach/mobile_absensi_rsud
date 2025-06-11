/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Modal, TouchableOpacity } from 'react-native';
import { z } from 'zod';

import { type MasterDataUmkmResponse } from '@/api/sada-sada';
import { TitleSecondary } from '@/components/title';
import { Button, type OptionType, View } from '@/components/ui';
import { Image, Input, Select, Text, YearPicker } from '@/components/ui';
import { white } from '@/components/ui/colors';
import { FileUploadInputDefault } from '@/components/ui/file-input-default';

type PickedImage = {
  uri: string;
  type: string;
  fileName?: string;
  name?: string;
};

const genderOptions: OptionType[] = [
  { label: 'Laki-laki', value: '1' },
  { label: 'Perempuan', value: '2' },
];

const statusPKHOptions: OptionType[] = [
  { label: 'Ya', value: '1' },
  { label: 'Tidak', value: '0' },
];

export const formSchema = z.object({
  berkasKTP: z.any().refine((file) => !!file, {
    message: 'Berkas KTP wajib diunggah',
  }),
  nomorIndukKependudukan: z.string().min(16, 'NIK harus 16 digit'),
  namaLengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  gender: z.string().min(1, 'Jenis kelamin wajib dipilih'),
  alamatPribadi: z.string().min(1, 'Alamat pribadi wajib diisi'),
  kodeDesaPribadi: z.string().min(1, 'Desa wajib dipilih'),
  kodeKecamatanPribadi: z.string().min(1, 'Kecamatan wajib dipilih'),
  nomorTelepon: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z
    .string()
    .email({ message: 'Format email tidak valid (harus contoh@email.com)' }),
  namaBank: z.string().min(1, 'Nama bank wajib diisi'),
  nomorRekening: z.string().min(1, 'Nomor rekening wajib diisi'),
  oss: z.string().min(1, 'Akun OSS wajib diisi'),
  ossPassword: z.string().min(1, 'Password OSS wajib diisi'),
  nib: z.string().min(1, 'NIB wajib diisi'),
  namaUsaha: z.string().min(1, 'Nama usaha wajib diisi'),
  kategoriUsaha: z.string().min(1, 'Kategori usaha wajib dipilih'),
  jenisUsaha: z.string().min(1, 'Jenis usaha wajib dipilih'),
  alamatUsaha: z.string().min(1, 'Alamat usaha wajib diisi'),
  kodeDesaUsaha: z.string().min(1, 'Desa usaha wajib dipilih'),
  kodeKecamatanUsaha: z.string().min(1, 'Kecamatan usaha wajib dipilih'),
  deskripsiUsaha: z.string().min(1, 'deskripsiUsaha wajib diisi'),
  omset: z.string().min(1, 'Omset wajib diisi'),
  laba: z.string().min(1, 'Laba wajib diisi'),
  modalUsaha: z.string().min(1, 'Modal usaha wajib diisi'),
  asset: z.string().min(1, 'Asset wajib diisi'),
  tenagaKerja: z.string().min(1, 'Tenaga kerja wajib diisi'),
  tahunBerdiri: z.string().min(4, 'Tahun berdiri wajib diisi'),
  statusPKH: z.string().min(1, 'Status PKH wajib dipilih'),
  pirt_bpom: z.string().min(1, 'Nomor PIRT wajib diisi'),
  halal: z.string().min(1, 'Nomor Halal wajib diisi'),
  hki: z.string().min(1, 'Nomor HKI wajib diisi'),
});

interface dataMasterUmkmProps {
  masterdata: MasterDataUmkmResponse;
}

export default function FormInputBinaan({ masterdata }: dataMasterUmkmProps) {
  const [form, setForm] = useState({
    berkasKTP: null as PickedImage | null,
    nomorIndukKependudukan: '',
    namaLengkap: '',
    gender: '',
    alamatPribadi: '',
    kodeDesaPribadi: '',
    kodeKecamatanPribadi: '',
    nomorTelepon: '',
    email: '',
    namaBank: '',
    nomorRekening: '',
    oss: '',
    ossPassword: '',
    nib: '',
    namaUsaha: '',
    kategoriUsaha: '',
    jenisUsaha: '',
    alamatUsaha: '',
    kodeDesaUsaha: '',
    kodeKecamatanUsaha: '',
    deskripsiUsaha: '',
    omset: '',
    laba: '',
    modalUsaha: '',
    asset: '',
    tenagaKerja: '',
    tahunBerdiri: '',
    statusPKH: '',
    pirt_bpom: '',
    halal: '',
    hki: '',
  });
  const [isPending, setIsPending] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [data, setData] = useState({
    status: 200,
    messages: '',
  });

  const dataDesa: OptionType[] = masterdata?.data?.desa
    ? masterdata.data.desa.map((desa) => ({
        label: desa.namaDesa,
        value: desa.idDesa,
      }))
    : [];

  const dataKecamatan: OptionType[] = masterdata?.data?.kecamatan
    ? masterdata.data.kecamatan.map((desa) => ({
        label: desa.namaKecamatan,
        value: desa.idKecamatan,
      }))
    : [];

  const dataJenisUsaha: OptionType[] = masterdata?.data?.jenisUsaha
    ? masterdata.data.jenisUsaha.map((desa) => ({
        label: desa.jenisUsaha,
        value: desa.idMasterJenisUsaha,
      }))
    : [];

  const dataKategoriUsaha: OptionType[] = masterdata?.data?.kategoriUsaha
    ? masterdata.data.kategoriUsaha.map((desa) => ({
        label: desa.namaKategori,
        value: desa.idKategoriUsaha,
      }))
    : [];

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = async () => {
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }
    const formData = new FormData();

    formData.append('berkasKTP', {
      uri: form.berkasKTP!.uri,
      type: form.berkasKTP!.type,
      name: form.berkasKTP!.name || 'ktp.jpg',
    } as any);

    formData.append('nomorIndukKependudukan', form.nomorIndukKependudukan);
    formData.append('namaLengkap', form.namaLengkap);
    formData.append('gender', form.gender);
    formData.append('alamatPribadi', form.alamatPribadi);
    formData.append('kodeDesaPribadi', form.kodeDesaPribadi);
    formData.append('kodeKecamatanPribadi', form.kodeKecamatanPribadi);
    formData.append('nomorTelepon', form.nomorTelepon);
    formData.append('email', form.email);
    formData.append('namaBank', form.namaBank);
    formData.append('nomorRekening', form.nomorRekening);
    formData.append('oss', form.oss);
    formData.append('ossPassword', form.ossPassword);
    formData.append('nib', form.nib);
    formData.append('namaUsaha', form.namaUsaha);
    formData.append('kategoriUsaha', form.kategoriUsaha);
    formData.append('jenisUsaha', form.jenisUsaha);
    formData.append('alamatUsaha', form.alamatUsaha);
    formData.append('kodeDesaUsaha', form.kodeDesaUsaha);
    formData.append('kodeKecamatanUsaha', form.kodeKecamatanUsaha);
    formData.append('deskripsiUsaha', form.deskripsiUsaha);
    formData.append('omset', form.omset);
    formData.append('laba', form.laba);
    formData.append('modalUsaha', form.modalUsaha);
    formData.append('asset', form.asset);
    formData.append('tenagaKerja', form.tenagaKerja);
    formData.append('tahunBerdiri', form.tahunBerdiri);
    formData.append('statusPKH', form.statusPKH);
    formData.append('pirt_bpom', form.pirt_bpom);
    formData.append('halal', form.halal);
    formData.append('hki', form.hki);
    setIsPending(true);
    try {
      const response = await axios.post(
        'https://diskopukm.deliserdangkab.go.id/API/deliserdangsehat/PendaftaranBinaan',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const res = response.data;

      if (res.status === 200) {
        setShowSuccessModal(true);
        setData(res);
      } else {
        Alert.alert('Gagal', res.messages ?? 'Terjadi kesalahan');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message = error.response.data?.messages || 'Data tidak valid.';
        Alert.alert('Validasi Gagal', message);
      } else {
        Alert.alert('Error', 'Gagal menghubungi server');
      }
    } finally {
      setIsPending(false);
    }
  };
  return (
    <View className="m-2">
      <TitleSecondary text="Pendaftaran" className="bg-[#0B3880]" />
      <View className="m-4">
        <FileUploadInputDefault
          label="Berkas Foto KTP"
          value={
            form.berkasKTP
              ? {
                  uri: form.berkasKTP.uri,
                  type: form.berkasKTP.type,
                  name: form.berkasKTP.name ?? 'file.jpg', // Pastikan selalu ada string
                }
              : null
          }
          onChange={(val) => handleChange('berkasKTP', val)}
          error={formErrors.berkasKTP}
        />
        <Input
          label="NIK"
          value={form.nomorIndukKependudukan}
          onChangeText={(val) => handleChange('nomorIndukKependudukan', val)}
          error={formErrors.nomorIndukKependudukan}
          placeholder="Ketik NIK Anda"
          keyboardType="number-pad"
        />
        <Input
          label="Nama Lengkap"
          value={form.namaLengkap}
          error={formErrors.namaLengkap}
          onChangeText={(val) => handleChange('namaLengkap', val)}
          placeholder="Ketik Nama Lengkap Anda"
        />
        <Select
          label="Jenis Kelamin"
          options={genderOptions}
          value={form.gender}
          error={formErrors.gender}
          onSelect={(option) => handleChange('gender', option)}
          placeholder="pilih Jenis Kelamin"
        />
        <Input
          label="Alamat Pribadi"
          value={form.alamatPribadi}
          error={formErrors.alamatPribadi}
          onChangeText={(val) => handleChange('alamatPribadi', val)}
          placeholder="Ketika Alamat Anda"
        />
        <Select
          label="Desa"
          value={form.kodeDesaPribadi}
          error={formErrors.kodeDesaPribadi}
          onSelect={(opt) => handleChange('kodeDesaPribadi', opt)}
          options={dataDesa}
          placeholder="Pilih Desa"
        />
        <Select
          label="Kecamatan"
          value={form.kodeKecamatanPribadi}
          error={formErrors.kodeKecamatanPribadi}
          onSelect={(opt) => handleChange('kodeKecamatanPribadi', opt)}
          options={dataKecamatan}
          placeholder="Pilih Kecamatan"
        />
        <Input
          label="Nomor Telepon"
          value={form.nomorTelepon}
          error={formErrors.nomorTelepon}
          onChangeText={(val) => handleChange('nomorTelepon', val)}
          placeholder="Ketik Nomor Telp Anda"
          keyboardType="number-pad"
        />
        <Input
          label="Email Pribadi"
          value={form.email}
          error={formErrors.email}
          onChangeText={(val) => handleChange('email', val)}
          placeholder="Ketik Email Anda"
          keyboardType="email-address"
        />
        <Input
          label="Masukkan Nama Bank"
          value={form.namaBank}
          error={formErrors.namaBank}
          onChangeText={(val) => handleChange('namaBank', val)}
          placeholder="Ketik Nama Bank"
        />
        <Input
          label="Masukkan Nomor Rekening"
          value={form.nomorRekening}
          error={formErrors.nomorRekening}
          onChangeText={(val) => handleChange('nomorRekening', val)}
          placeholder="Ketik Nomor Rekening"
          keyboardType="number-pad"
        />
        <Input
          label="Akun OSS"
          value={form.oss}
          error={formErrors.oss}
          onChangeText={(val) => handleChange('oss', val)}
          placeholder="Ketik Akun OSS"
        />
        <Input
          label="Password OSS"
          value={form.ossPassword}
          error={formErrors.ossPassword}
          onChangeText={(val) => handleChange('ossPassword', val)}
          placeholder="Ketik Password OSS Anda"
        />
        <Input
          label="NIB"
          value={form.nib}
          error={formErrors.nib}
          onChangeText={(val) => handleChange('nib', val)}
          placeholder="Ketik NIB Anda"
        />
        <Input
          label="Nama Usaha"
          value={form.namaUsaha}
          error={formErrors.namaUsaha}
          onChangeText={(val) => handleChange('namaUsaha', val)}
          placeholder="Ketik Nama Usaha"
        />
        <Select
          label="Kategori Usaha"
          value={form.kategoriUsaha}
          error={formErrors.kategoriUsaha}
          onSelect={(opt) => handleChange('kategoriUsaha', opt)}
          options={dataKategoriUsaha}
          placeholder="Pilih Kategori Usaha"
        />
        <Select
          label="Jenis Usaha"
          value={form.jenisUsaha}
          error={formErrors.jenisUsaha}
          onSelect={(opt) => handleChange('jenisUsaha', opt)}
          options={dataJenisUsaha}
          placeholder="Pilih Jenis Usaha"
        />
        <Input
          label="Alamat Usaha"
          value={form.alamatUsaha}
          error={formErrors.alamatUsaha}
          onChangeText={(val) => handleChange('alamatUsaha', val)}
          placeholder="Ketik Alamat Usaha"
        />
        <Select
          label="Desa Tempat Usaha"
          value={form.kodeDesaUsaha}
          error={formErrors.kodeDesaUsaha}
          onSelect={(opt) => handleChange('kodeDesaUsaha', opt)}
          options={dataDesa}
          placeholder="Pilih Desa Tempat Usaha"
        />
        <Select
          label="Kecamatan Tempat Usaha"
          value={form.kodeKecamatanUsaha}
          error={formErrors.kodeKecamatanUsaha}
          onSelect={(opt) => handleChange('kodeKecamatanUsaha', opt)}
          options={dataKecamatan}
          placeholder="Pilih Kecamatan Tempat Usaha"
        />
        <Input
          label="deskripsi Usaha"
          value={form.deskripsiUsaha}
          error={formErrors.deskripsiUsaha}
          onChangeText={(val) => handleChange('deskripsiUsaha', val)}
          placeholder="Ketik deskripsi Usaha"
        />
        <Input
          label="Omset"
          value={form.omset}
          error={formErrors.omset}
          onChangeText={(val) => handleChange('omset', val)}
          placeholder="Ketik Omset"
          keyboardType="number-pad"
        />
        <Input
          label="Laba"
          value={form.laba}
          error={formErrors.laba}
          onChangeText={(val) => handleChange('laba', val)}
          placeholder="Ketik Laba"
          keyboardType="number-pad"
        />
        <Input
          label="Modal Usaha"
          value={form.modalUsaha}
          error={formErrors.modalUsaha}
          onChangeText={(val) => handleChange('modalUsaha', val)}
          placeholder="Ketik Modal Usaha"
          keyboardType="number-pad"
        />
        <Input
          label="Asset"
          value={form.asset}
          error={formErrors.asset}
          onChangeText={(val) => handleChange('asset', val)}
          placeholder="Ketik Asset"
        />
        <Input
          label="Tenaga Kerja"
          value={form.tenagaKerja}
          error={formErrors.tenagaKerja}
          onChangeText={(val) => handleChange('tenagaKerja', val)}
          placeholder="Ketik Tenaga Kerja"
          keyboardType="number-pad"
        />
        <YearPicker
          label="Tahun Berdiri"
          placeholder="Tahun Berdiri"
          value={form.tahunBerdiri}
          error={formErrors.tahunBerdiri}
          onChange={(val) => handleChange('tahunBerdiri', val)}
        />
        <Select
          label="Status PKH"
          value={form.statusPKH}
          error={formErrors.statusPKH}
          onSelect={(opt) => handleChange('statusPKH', opt)}
          options={statusPKHOptions}
          placeholder="Ketik Status PKH"
        />
        <Input
          label="Nomor PIRT"
          value={form.pirt_bpom}
          error={formErrors.pirt_bpom}
          onChangeText={(val) => handleChange('pirt_bpom', val)}
          placeholder="Ketik Nomor PIRT"
        />
        <Input
          label="Nomor Halal"
          value={form.halal}
          error={formErrors.halal}
          onChangeText={(val) => handleChange('halal', val)}
          placeholder="Ketik Nomor Halal"
        />
        <Input
          label="Nomor KHI"
          value={form.hki}
          error={formErrors.hki}
          onChangeText={(val) => handleChange('hki', val)}
          placeholder="Ketik Nomor KHI"
        />

        <Button
          label="Submit"
          onPress={handleSubmit}
          loading={isPending}
          className="bg-[#015757]"
          icon={<Send color={white} size={18} />}
        />
        <AlertModal
          visible={showSuccessModal}
          onConfirm={() => setShowSuccessModal(false)}
          pesan={data.messages}
        />
      </View>
    </View>
  );
}

const AlertModal = ({
  visible,
  onConfirm,
  pesan,
}: {
  visible: boolean;
  onConfirm: () => void;
  pesan: string;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    className="rounded-xl"
  >
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <View className="w-80 rounded-lg bg-white p-6">
        <Image
          source={require('../../../../../assets/image/pelayanan-publik/koperasi/aprove.png')}
          className="mb-4 size-16 self-center"
          contentFit="contain"
        />
        <Text className="mb-4 text-center text-base font-semibold">
          {pesan}
        </Text>
        <View className="flex-row justify-center space-x-4">
          <TouchableOpacity
            className="mx-2 rounded-xl bg-[#0B3880] px-4 py-2"
            onPress={onConfirm}
          >
            <Text className="font-bold text-white">Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
