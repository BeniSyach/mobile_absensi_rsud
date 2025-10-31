import { StyleSheet } from 'react-native';

import { type KegiatanItem } from '@/api';
import { Text, View } from '@/components/ui';
import { formatTanggalWIB } from '@/utils/format-days';

interface CardProps {
  dataHarian: KegiatanItem;
}

export default function CardListKomponentPejabat({ dataHarian }: CardProps) {
  const statusMap = {
    0: { label: 'Pending', color: '#D97706' }, // Amber-600
    1: { label: 'Disetujui', color: '#065F46' }, // Green-800
    2: { label: 'Ditolak', color: '#991B1B' }, // Red-800
  };

  const { label, color } = statusMap[dataHarian.status] || {
    label: 'Unknown',
    color: '#6B7280', // Gray-500
  };
  return (
    <View style={styles.card}>
      {/* Tanggal dan Waktu */}
      <Text style={styles.dateText}>
        {formatTanggalWIB(dataHarian.created_at)}
      </Text>

      {/* Judul */}
      <Text style={styles.title}>{dataHarian.uraian_tugas}</Text>

      {/* RHK */}
      <Text style={styles.meta}>
        <Text style={styles.metaLabel}>RHK: </Text> {dataHarian?.uraian_rhk}
      </Text>

      {/* Indikator */}
      <Text style={styles.meta}>
        <Text style={styles.metaLabel}>Indikator: </Text>{' '}
        {dataHarian?.indikator}
      </Text>

      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{label}</Text>
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
