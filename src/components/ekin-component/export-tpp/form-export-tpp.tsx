/* eslint-disable max-lines-per-function */
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ExportTPPPegawai } from '@/api';
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

export default function FormExportTPP({ onPreview }: FormExportTPPProps) {
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

      const arrayBuffer = await ExportTPPPegawai.fetcher({
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
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin diperlukan',
          'Akses penyimpanan diperlukan untuk mengunduh file.'
        );
        return;
      }

      const response = await ExportTPPPegawai.fetcher({
        nik: storedMessage?.nik ?? '',
        bulan: parseInt(bulan, 10),
        tahun: new Date().getFullYear(),
      });

      const base64Data = Buffer.from(response).toString('base64');

      const fileName = `export-tpp-${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`; // ⬅️ Ubah ke documentDirectory

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const info = await FileSystem.getInfoAsync(fileUri);
      if (!info.exists) {
        throw new Error('File tidak ditemukan.');
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);

      Alert.alert('Sukses', 'File berhasil diunduh dan disimpan ke galeri.');
    } catch (err) {
      console.error('Export error detail:', err); // ⬅️ log detail error
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengunduh file.');
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
