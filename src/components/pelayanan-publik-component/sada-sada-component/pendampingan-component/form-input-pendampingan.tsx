/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Modal, TouchableOpacity } from 'react-native';
import { z } from 'zod';

import { Button, Image, Input, Text, View } from '@/components/ui';
import { white } from '@/components/ui/colors';

const searchSchema = z.object({
  nik: z.string().min(16, 'NIK harus 16 digit'),
  keterangan: z.string().min(1, 'Keterangan tidak boleh kosong'),
});

export default function FormInputPendampingan() {
  const [nik, setNik] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState({
    status: 200,
    messages: '',
  });
  const handleCari = async () => {
    const result = searchSchema.safeParse({ nik, keterangan });
    if (!result.success) {
      // Mapping error per field
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }
    setFormErrors({});
    setIsPending(true);
    try {
      const response = await axios.post(
        'https://diskopukm.deliserdangkab.go.id/API/deliserdangsehat/PermohonanLayanan',
        {
          nomorIndukKependudukan: nik,
          keteranganPermohonan: keterangan,
        }
      );
      const res = response.data;
      if (res.status === 200) {
        setShowSuccessModal(true);
        setData(res);
      } else {
        Alert.alert('Data tidak ditemukan', 'Gagal Mengirim Berkas');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const message =
          error.response.data?.messages || 'Permintaan tidak valid.';
        Alert.alert('Permintaan Gagal', message);
      } else {
        Alert.alert('Gagal Menghubungi Server', 'Server Tidak Dapat Terhubung');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View>
      <View className="m-2">
        <Text className="text-xl font-bold text-[#044d4d] underline">
          Ajukan Permohonan
        </Text>
      </View>
      <View className="m-4">
        <Input
          label="Nomor NIK"
          placeholder="Masukkan Nomor NIK"
          onChangeText={(text) => {
            setNik(text);
            setFormErrors((prev) => ({ ...prev, nik: '' })); // hapus error saat edit
          }}
          error={formErrors.nik}
          keyboardType="number-pad"
        />
        <Input
          label="Keterangan Permohonan"
          placeholder="Masukkan Keterangan"
          value={keterangan}
          onChangeText={(text) => {
            setKeterangan(text);
            setFormErrors((prev) => ({ ...prev, keterangan: '' }));
          }}
          error={formErrors.keterangan}
        />
        <Button
          label="Ajukan"
          icon={<Send size={18} color={white} />}
          className="bg-[#015757]"
          loading={isPending}
          onPress={handleCari}
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
