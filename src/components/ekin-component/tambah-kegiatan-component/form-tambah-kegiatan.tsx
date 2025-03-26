import { TextInput } from 'react-native';

import { Text, View } from '@/components/ui';

export default function FormTambahKegiatan() {
  return (
    <View className="bg-whites m-2 rounded-2xl bg-white">
      <View className="p-5">
        <Text className="mb-2 text-gray-600">Urian Tugas</Text>
        <TextInput
          className="mb-2 rounded-lg border p-2"
          placeholder="Uraian Tugas"
        />
        <Text className=" text-gray-600">Lama Waktu</Text>
        <TextInput
          className="mb-2 rounded-lg border p-2"
          placeholder="Lama Waktu (menit)"
        />
        <Text className=" text-gray-600">Jumlah Capaian Kegiatan</Text>
        <TextInput
          className="mb-2 rounded-lg border p-2"
          placeholder="Jumlah Capaian Kegiatan"
        />
        <View className="flex-row justify-between">
          <View className="mr-1 flex-1">
            <Text className="text-gray-600">Tanggal</Text>
            <TextInput className="mb-2 rounded-lg border p-2" />
          </View>
          <View className="mx-2 bg-white"></View>
          <View className="ml-1 flex-1">
            <Text className="text-gray-600">Jam</Text>
            <TextInput className="mb-2 rounded-lg border p-2" />
          </View>
        </View>
        <Text className=" text-gray-600">Rencana Hasil Kerja</Text>
        <TextInput
          className="mb-2 rounded-lg border p-2"
          placeholder="Rencana Hasil Kerja"
        />
        <Text className=" text-gray-600">Indikator</Text>
        <TextInput
          className="mb-2 rounded-lg border p-2"
          placeholder="Indikator"
        />
      </View>
    </View>
  );
}
