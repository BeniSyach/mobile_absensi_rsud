/* eslint-disable max-lines-per-function */
import axios, { type AxiosError } from 'axios';
import { Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, TouchableOpacity } from 'react-native';
import { z } from 'zod';

import { Button, Image, Input, MaskedInput, Text, View } from '@/components/ui';

const searchSchema = z.object({
  nik: z.string().min(16, 'NIK harus 16 digit'),
  hp: z.string().min(1, 'Nomor Hp tidak boleh kosong'),
  nomor: z.string().min(1, 'NOP tidak boleh kosong'),
});

export default function FormInputEsppt() {
  const [nik, setNik] = useState('');
  const [hp, setHp] = useState('');
  const [nomor, setNomor] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const handleCari = async () => {
    const result = searchSchema.safeParse({ nik, nomor, hp });
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
    setIsPending(true); // Set loading state
    try {
      const response = await axios.get(
        'https://dinkesds-simpus.deliserdangkab.go.id/php/ds-sehat/pelayanan-publik/bapenda/cek-cetak-esppt.php',
        {
          params: {
            nop: nomor,
            hp,
            nik,
          },
        }
      );
      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        Alert.alert('Data tidak ditemukan', 'Gagal Mengirim Berkas');
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // Server merespons dengan status selain 2xx
        console.error('Response error:', axiosError.response.data);
        Alert.alert(
          'Gagal Menghubungi Server',
          `Error ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`
        );
      } else if (axiosError.request) {
        // Request dibuat tapi tidak ada respons
        console.error('No response:', axiosError.request);
        Alert.alert(
          'Gagal Menghubungi Server',
          'Tidak ada respons dari server'
        );
      } else {
        // Kesalahan saat membuat request
        console.error('Request setup error:', axiosError.message);
        Alert.alert('Kesalahan Permintaan', axiosError.message);
      }
    } finally {
      setIsPending(false); // Set selesai loading
    }
  };
  return (
    <View className="m-2">
      <MaskedInput
        type="custom"
        options={{ mask: '99.99.999.999.999.9999.9' }}
        placeholder="00.00.000.000.000.0000.0"
        value={nomor}
        onChangeText={(text) => {
          setNomor(text);
          setFormErrors((prev) => ({ ...prev, nomor: '' })); // hapus error saat edit
        }}
        error={formErrors.nomor}
        keyboardType="number-pad"
        label="Nomor Objek Pajak (NOP)"
      />
      <Input
        placeholder="NIK"
        value={nik}
        label="Nomor Induk Kependudukan (NIK)"
        onChangeText={(text) => {
          setNik(text);
          setFormErrors((prev) => ({ ...prev, nik: '' })); // hapus error saat edit
        }}
        error={formErrors.nik}
        keyboardType="number-pad"
      />
      <Input
        label="No. WhatsApp"
        placeholder="No. WhatsApp"
        value={hp}
        onChangeText={setHp}
        keyboardType="number-pad"
        error={formErrors.hp}
      />
      <Button
        label="Kirim Bukti Ke WhatsApp"
        onPress={handleCari}
        loading={isPending}
        className="bg-[#007AFF]"
        icon={<Send size={18} color="white" />}
      />
      <AlertModal
        visible={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        nomor={hp}
      />
    </View>
  );
}

const AlertModal = ({
  visible,
  onConfirm,
  nomor,
}: {
  visible: boolean;
  onConfirm: () => void;
  nomor: string;
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
          source={require('../../../../../assets/image/pelayanan-publik/bapenda/Send.png')}
          className="mb-4 size-16 self-center"
          contentFit="contain"
        />
        <Text className="mb-4 text-center text-base font-semibold">
          Periksa WhatsApp Anda
        </Text>
        <Text className="mb-4 text-center text-base font-semibold">
          Kami Telah Mengirimkan Bukti ke No. {nomor}
        </Text>
        <Text className="mb-4 text-center text-base font-semibold">
          Mohon Periksa Kotak Masuk WhatsApp Anda
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
