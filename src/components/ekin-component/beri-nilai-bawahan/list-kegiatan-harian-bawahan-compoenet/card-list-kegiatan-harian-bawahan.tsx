/* eslint-disable max-lines-per-function */
import { CircleCheckBig, Eye, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { type Tagihan } from '@/api/bapenda';
import { AlertModal } from '@/components/title-second';
import { Button, Text, View } from '@/components/ui';

interface CardProps {
  dataTagihan: Tagihan;
}

export default function CardListKegiatanHarianBawahan({
  dataTagihan,
}: CardProps) {
  console.log(dataTagihan);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSetujui = () => {
    setShowConfirmModal(true); // tampilkan konfirmasi
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setModalVisible(false);
    console.log('✅ Data disetujui secara final');
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleTolak = () => {
    console.log('❌ Ditolak:', dataTagihan);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.card}>
        {/* Tanggal dan Waktu */}
        <Text style={styles.dateText}>Senin, 17 Agustus 2025 | 12.00 Wib</Text>

        {/* Judul */}
        <Text style={styles.title}>
          Memverifikasi Berkas serta menolak gratifikasi
        </Text>

        {/* RHK */}
        <Text style={styles.meta}>
          <Text style={styles.metaLabel}>RHK: </Text> Terlaksananya Tindakan
          Khusus..........
        </Text>

        {/* Indikator */}
        <Text style={styles.meta}>
          <Text style={styles.metaLabel}>Indikator: </Text>
          Jumlah Berkas yang di proses..........
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
            <Text style={styles.modalTitle}>Detail Kegiatan</Text>

            <View style={styles.formGroup}>
              <Text style={styles.metaLabel}>Judul:</Text>
              <TextInput
                value={dataTagihan?.J_TEMPO ?? ''}
                style={styles.textInput}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.metaLabel}>Tahun Pajak:</Text>
              <TextInput
                value={dataTagihan?.THN_PAJAK_SPPT ?? ''}
                style={styles.textInput}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.metaLabel}>Pokok:</Text>
              <TextInput
                value={String(dataTagihan?.POKOK ?? '')}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.metaLabel}>Denda:</Text>
              <TextInput
                value={String(dataTagihan?.DENDA ?? '')}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.metaLabel}>Total:</Text>
              <TextInput
                value={String(dataTagihan?.TOTAL ?? '')}
                keyboardType="numeric"
                style={styles.textInput}
              />
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
              />

              <Button
                label="Tolak"
                variant="outline"
                className="bg-[#C9DEFE]"
                icon={<X size={24} color="black" />}
                onPress={handleTolak}
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
    fontSize: 16,
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
