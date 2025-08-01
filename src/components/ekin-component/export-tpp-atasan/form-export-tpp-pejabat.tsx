/* eslint-disable max-lines-per-function */
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ExportTPPPejabat } from '@/api';
import { Button, type OptionType, Select, View } from '@/components/ui';
import { getMessage } from '@/lib';

type FormExportTPPProps = {
  onPreview: (data: string) => void;
};

const bulanLabel = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const bulanOptions: OptionType[] = bulanLabel.map((label, i) => ({
  label,
  value: (i + 1).toString().padStart(2, '0'),
}));

export default function FormExportTPPPejabat({
  onPreview,
}: FormExportTPPProps) {
  const storedMessage = getMessage();
  const [bulan, setBulan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTampilkan = async () => {
    if (!bulan) {
      Alert.alert('Peringatan', 'Silakan pilih bulan terlebih dahulu.');
      return;
    }

    try {
      setIsLoading(true);

      const arrayBuffer = await ExportTPPPejabat.fetcher({
        nik: storedMessage?.nik ?? '',
        bulan: parseInt(bulan, 10),
        tahun: new Date().getFullYear(),
      });

      console.log('Tipe:', typeof arrayBuffer);
      console.log(
        'InstanceOf ArrayBuffer:',
        arrayBuffer instanceof ArrayBuffer
      );

      const base64Data = Buffer.from(arrayBuffer).toString('base64');

      const fileUri = `${FileSystem.documentDirectory}preview-tpp-${bulan}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      onPreview(fileUri);
    } catch (err) {
      console.error(err);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // 2. Fetch PDF dari API
      const response = await ExportTPPPejabat.fetcher({
        nik: storedMessage?.nik ?? '',
        bulan: parseInt(bulan, 10),
        tahun: new Date().getFullYear(),
      });

      // 2. Ubah ke base64
      const base64Data = Buffer.from(response).toString('base64');

      // 3. Simpan sementara ke file cache
      const fileUri = `${FileSystem.cacheDirectory}temp-spt-${Date.now()}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 4. Cek apakah fitur sharing tersedia
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Tidak tersedia',
          'Fitur membuka file tidak tersedia di perangkat ini'
        );
        return;
      }

      // 5. Buka file PDF melalui sharing (akan tampil pilihan aplikasi PDF viewer)
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Buka file PDF',
      });
    } catch (err) {
      console.error('Gagal membuka PDF:', err);
      Alert.alert('Gagal', 'Terjadi kesalahan saat membuka file PDF');
    }
  };
  return (
    <View>
      <View className="mx-5 mt-5">
        <Select
          label="Bulan"
          placeholder="Pilih Bulan"
          options={bulanOptions}
          value={bulan}
          onSelect={(value) => setBulan(String(value))}
        />
      </View>
      <View className="flex-row items-center justify-center gap-5 px-5">
        <Button
          label={isLoading ? 'Memuat...' : 'Tampilkan'}
          className="rounded-lg bg-[#C9DEFE] font-bold text-black"
          variant="outline"
          onPress={handleTampilkan}
          disabled={isLoading}
        />
        <Button
          label="Export"
          className="rounded-lg bg-[#C9DEFE] font-bold text-black"
          variant="outline"
          onPress={handleExport}
        />
      </View>
    </View>
  );
}
