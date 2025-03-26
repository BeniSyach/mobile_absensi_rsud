import { TextInput } from 'react-native';

import { Text, View } from '@/components/ui';

export default function FormBerkasPendukung() {
  return (
    <View>
      <Text className="mb-4 text-xl font-bold text-[#0B3880]">Pendidikan</Text>

      <Text className="mb-2 text-gray-600">Jurusan</Text>
      <TextInput
        className="rounded-lg border bg-[#C9DEFE] p-2"
        placeholder="Jurusan"
      />

      <Text className="mb-2 text-gray-600">TIngkat Pendidikan</Text>
      <TextInput
        className="rounded-lg border bg-[#C9DEFE] p-2"
        placeholder="TIngkat Pendidikan"
      />

      <Text className="mb-2 text-gray-600">Nama Perguruan</Text>
      <TextInput
        className="rounded-lg border bg-[#C9DEFE] p-2"
        placeholder="Nama Perguruan"
      />

      <Text className="mb-2 text-gray-600">Lokasi</Text>
      <TextInput
        className="rounded-lg border bg-[#C9DEFE] p-2"
        placeholder="Lokasi"
      />

      <Text className="mb-2 text-gray-600">Rektor/Kepsek</Text>
      <TextInput
        className="rounded-lg border bg-[#C9DEFE] p-2"
        placeholder="Rektor/Kepsek"
      />

      <Text className="mb-2 text-gray-600">Akreditasi</Text>
      <TextInput
        className="rounded-lg border bg-[#C9DEFE] p-2"
        placeholder="Akreditasi"
      />

      <Text className="mb-2 text-gray-600">Tanggal Lulus</Text>
      <TextInput
        className="rounded-lg border bg-[#C9DEFE] p-2"
        placeholder="Tanggal Lulus"
      />
    </View>
  );
}
