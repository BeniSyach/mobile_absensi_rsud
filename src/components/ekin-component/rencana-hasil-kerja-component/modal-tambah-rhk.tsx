import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface ModalHasilKerjaProps {
  visible: boolean;
  onClose: () => void;
}

const ModalHasilKerja: React.FC<ModalHasilKerjaProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-11/12 rounded-2xl bg-white p-6">
          <Text className="mb-4 text-center text-lg font-bold">
            Detail Hasil Kerja
          </Text>
          <Text className="mb-6 text-base text-gray-700">
            Ini adalah isi dari modal hasil kerja. Tambahkan konten sesuai
            kebutuhan.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2"
          >
            <Text className="text-center font-semibold text-white">Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalHasilKerja;
