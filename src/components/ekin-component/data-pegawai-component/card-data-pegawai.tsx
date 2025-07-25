/* eslint-disable max-lines-per-function */
import { ScrollView } from 'react-native';

import { useGetUser } from '@/api';
import { TitleSecond } from '@/components/title-second';
import { Text, View } from '@/components/ui';
import { getMessage } from '@/lib';

import EditDataPegawaiEkin from './edit-data-pegawai-ekin';

const renderField = (label: string, value: string | null | undefined) => {
  const getValue = (val: string | null | undefined) => {
    if (val === null || val === undefined || val === '') {
      return '-';
    }
    return val;
  };

  return (
    <View className="flex-row justify-between border-b border-gray-200 py-2">
      <Text className="w-1/2 font-medium text-gray-700">{label}</Text>
      <Text className="w-1/2 text-right text-gray-900">{getValue(value)}</Text>
    </View>
  );
};

export default function CardDataPegawaiComponent() {
  const storedMessage = getMessage();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUser(storedMessage?.nik ?? '');

  if (isLoading) return <Text>Loading...</Text>;
  if (isError || !user) return <Text>Error loading user data</Text>;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View className="mt-10 w-full items-center px-4 pt-6">
        <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
          <TitleSecond
            text="Data Pegawai"
            statusEdit={true}
            className="bg-[#0B3880]"
            renderForm={() => <EditDataPegawaiEkin />}
          />

          {renderField('Nama Lengkap', user.data.nama)}
          {renderField('NIP', user.data.nip)}
          {renderField('NIK', user.data.nik)}
          {renderField(
            'Alamat',
            user.data.alamat.length > 25
              ? `${user.data.alamat.substring(0, 25)}...`
              : user.data.alamat
          )}
          {renderField(
            'Unit Kerja',
            user.data.nama_unit_kerja.length > 25
              ? `${user.data.nama_unit_kerja.substring(0, 25)}...`
              : user.data.nama_unit_kerja
          )}
          {renderField('Jenis Kelamin', user.data.jenis_kelamin)}
          {renderField('Jabatan', user.data.jenis_kelamin)}
          {renderField('Pangkat', user.data.jenis_kelamin)}
          {renderField('Golongan', user.data.jenis_kelamin)}
          {renderField('Atasan', user.data.jenis_kelamin)}
          {renderField('Status Pegawai', user.data.nama_jenis_pegawai)}
        </View>
      </View>
    </ScrollView>
  );
}
