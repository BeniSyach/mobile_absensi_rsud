import { StyleSheet } from 'react-native';

import { type Tagihan } from '@/api/bapenda';
import { Text, View } from '@/components/ui';

interface CardProps {
  dataTagihan: Tagihan;
}

export default function CardListKomponent({ dataTagihan }: CardProps) {
  console.log(dataTagihan);
  return (
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Sudah Disetujui</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB', // tailwind border-gray-300
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#6B7280', // tailwind text-gray-500
  },
  title: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 22,
  },
  meta: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563', // text-gray-600
  },
  metaLabel: {
    fontWeight: '500',
    color: '#4B5563',
  },
  statusContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#065F46', // tailwind bg-green-800
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
