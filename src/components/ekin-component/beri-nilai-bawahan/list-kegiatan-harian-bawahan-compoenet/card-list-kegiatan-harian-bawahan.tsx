/* eslint-disable max-lines-per-function */
import { CircleCheckBig, Eye, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { type DetailKegiatan, PutKegiatanHarian } from '@/api';
import { AlertModal } from '@/components/title-second';
import { Button, showErrorMessage, Text, View } from '@/components/ui';
import { formatTanggalWIB } from '@/utils/format-days';

interface CardProps {
  dataCard: DetailKegiatan;
}

export default function CardListKegiatanHarianBawahan({ dataCard }: CardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { mutateAsync: putDetailKegiatan, isPending: isPut } =
    PutKegiatanHarian();

  const handleSetujui = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    setModalVisible(false);
    console.log('✅ Data disetujui secara final');

    try {
      const response = await putDetailKegiatan({
        id: dataCard?.id?.toString() ?? '-',
        status: 1,
      });
      console.log('✅ Data berhasil dikirim:', response);

      showMessage({
        message: 'Kegiatan harian berhasil disimpan.',
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
      } else if (error?.error) {
        errorMessage = error.error;
      }

      showErrorMessage(errorMessage);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleTolak = async () => {
    console.log('❌ Ditolak:', dataCard);
    setModalVisible(false);

    try {
      const response = await putDetailKegiatan({
        id: dataCard?.id?.toString() ?? '-',
        status: 2,
      });
      console.log('✅ Data berhasil dikirim:', response);

      showMessage({
        message: 'Kegiatan harian berhasil disimpan.',
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
      } else if (error?.error) {
        errorMessage = error.error;
      }

      showErrorMessage(errorMessage);
    }
  };

  return (
    <>
      <View style={styles.card}>
        {/* Tanggal dan Waktu */}
        <Text style={styles.dateText}>
          {' '}
          {formatTanggalWIB(dataCard?.tgl_kinerja)}
        </Text>

        {/* Judul */}
        <Text style={styles.title}>{dataCard?.uraian_tugas ?? '-'}</Text>

        {/* RHK */}
        <Text style={styles.meta}>
          <Text style={styles.metaLabel}>RHK: </Text>{' '}
          {dataCard?.rhk_staff?.uraian ?? '-'}
        </Text>

        {/* Indikator */}
        <Text style={styles.meta}>
          <Text style={styles.metaLabel}>Indikator: </Text>
          {dataCard?.rhk_staff?.indikator ?? '-'}
        </Text>

        {/* Status */}
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => setModalVisible(true)}
          >
            <Eye size={16} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.detailText}>Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Tombol Close */}
            <View className="items-end">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="p-2"
                hitSlop={10}
              >
                <X size={24} color="black" />
              </Pressable>
            </View>

            <Text style={styles.modalTitle}>Detail Kegiatan</Text>

            <View style={styles.formGroup}>
              <Text className="mb-2 text-lg font-semibold text-black">
                Uraian Tugas :
              </Text>
              <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
                <TextInput
                  className="flex-1 p-2 text-black"
                  value={dataCard?.uraian_tugas ?? '-'}
                  editable={false}
                />
              </View>
            </View>

            <View>
              <Text className="mb-2 text-lg font-semibold text-black">
                Lama Waktu :
              </Text>
              <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
                <TextInput
                  className="flex-1 p-2 text-black"
                  keyboardType="number-pad"
                  value={dataCard?.waktu_kinerja?.toString() ?? '-'}
                  editable={false}
                />
                <Text className="ml-2 text-gray-500">Menit</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text className="mb-2 text-lg font-semibold text-black">
                Jumlah Capaian Kegiatan :
              </Text>
              <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
                <TextInput
                  className="flex-1 p-2 text-black"
                  value={dataCard?.nilai?.toString() ?? '-'}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text className="mb-2 text-lg font-semibold text-black">
                Tangal Mulai Kegaitan :
              </Text>
              <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
                <TextInput
                  className="flex-1 p-2 text-black"
                  value={dataCard?.tgl_kinerja ?? '-'}
                  editable={false}
                />
              </View>
            </View>

            <View>
              <Text className="mb-2 text-lg font-semibold text-black">
                Jam Mulai Kegiatan :
              </Text>
              <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
                <TextInput
                  className="flex-1 p-2 text-black"
                  keyboardType="number-pad"
                  value={dataCard?.waktu_kinerja?.toString() ?? '-'}
                  editable={false}
                />
                <Text className="ml-2 text-gray-500">Wib</Text>
              </View>
            </View>

            <View>
              <Text className="mb-2 text-lg font-semibold text-black">
                Jam Selesai Kegiatan :
              </Text>
              <View className="mb-2 flex-row items-center rounded-lg border border-black bg-white px-3 py-2">
                <TextInput
                  className="flex-1 p-2 text-black"
                  keyboardType="number-pad"
                  value={dataCard?.waktu_kinerja?.toString() ?? '-'}
                  editable={false}
                />
                <Text className="ml-2 text-gray-500">Wib</Text>
              </View>
            </View>

            <View style={styles.modalButtonGroup} className="gap-2">
              <Button
                label="Setujui"
                variant="outline"
                className="bg-blue-500"
                icon={
                  <CircleCheckBig
                    size={16}
                    color="white"
                    style={{ marginRight: 6 }}
                  />
                }
                onPress={handleSetujui}
                disabled={isPut}
              />

              <Button
                label="Tolak"
                variant="outline"
                className="bg-[#C9DEFE]"
                icon={<X size={24} color="black" />}
                onPress={handleTolak}
                disabled={isPut}
              />
            </View>
          </View>
        </View>
      </Modal>

      <AlertModal
        visible={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    padding: 16,
    elevation: 3,
  },
  dateText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#6B7280',
  },
  title: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  meta: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
  },
  metaLabel: {
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    marginTop: 20,
  },
  approveButton: {
    backgroundColor: '#047857',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#B91C1C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 10,
  },
});
