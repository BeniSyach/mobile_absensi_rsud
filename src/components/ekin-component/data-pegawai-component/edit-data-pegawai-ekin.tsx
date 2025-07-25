/* eslint-disable max-lines-per-function */
import { TextInput, View } from 'react-native';

import { Select, Text } from '@/components/ui';

export default function EditDataPegawaiEkin() {
  return (
    <View className="bg-whites m-2 mt-7 rounded-2xl bg-white">
      <Text className="mb-2 text-lg font-semibold text-black">
        Nama Lengkap
      </Text>
      <TextInput
        className="mb-2 rounded-lg border p-2 py-4"
        placeholder="Nama Lengkap"
      />
      <Text className="mb-2 text-lg font-semibold text-black">NIP</Text>
      <TextInput
        className="mb-2 rounded-lg border p-2 py-4"
        placeholder="NIP"
      />
      <Text className="mb-2 text-lg font-semibold text-black">NIK</Text>
      <TextInput
        className="mb-2 rounded-lg border p-2 py-4"
        placeholder="NIK"
      />
      <Text className="mb-2 text-lg font-semibold text-black">OPD/UPT</Text>
      <TextInput
        className="mb-2 rounded-lg border p-2 py-4"
        placeholder="OPD/UPT"
      />
      <Select
        label="Jabatan"
        placeholder="Pilih Jabatan"
        options={[]}
        onSelect={() => {}}
      />
      <Select
        label="Pangkat"
        placeholder="Pilih Pangkat"
        options={[]}
        onSelect={() => {}}
      />
      <Select
        label="Golongan"
        placeholder="Pilih Golongan"
        options={[]}
        onSelect={() => {}}
      />
      <Select
        label="Atasan"
        placeholder="Pilih Atasan"
        options={[]}
        onSelect={() => {}}
      />
    </View>
  );
}
