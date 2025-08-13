/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native';

import { useGetUser, type UserDataEkin, type UserPegawai } from '@/api';
import { Image, Text, View } from '@/components/ui';

interface Props {
  data: UserPegawai | null;
  dataProfileEkin?: UserDataEkin;
}

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

export default function CardDataPegawaiComponent({
  data,
  dataProfileEkin,
}: Props) {
  const route = useRouter();
  const { data: user, isLoading, isError } = useGetUser(data?.nik ?? '');

  if (isLoading) return <Text>Loading...</Text>;
  if (isError || !user) return <Text>Error loading user data</Text>;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View className="mt-10 w-full items-center px-4 pt-6">
        <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
          <View className="flex-row items-center ">
            <Text className="my-2 mr-2 text-xl font-bold tracking-tight dark:text-black">
              Data Pegawai
            </Text>
            <View className={`h-[2px] flex-1 bg-[#0B3880]`} />
            <TouchableOpacity
              onPress={() =>
                route.push({
                  pathname: '/ekin/pegawai-ekin/edit-pegawai-ekin',
                  params: {
                    id: dataProfileEkin?.id,
                    nama: dataProfileEkin?.nama,
                    nip: data?.nip,
                    nik: data?.nik,
                    kode_opd: data?.kode_unit_kerja,
                    jabatan: dataProfileEkin?.detail_pegawai.data.jabatan_id,
                    pangkat: dataProfileEkin?.detail_pegawai.data.pangkat_id,
                    golongan:
                      dataProfileEkin?.detail_pegawai.data.golongan_ruang_id,
                    eselon: dataProfileEkin?.detail_pegawai.data.nama_eselon,
                    atasan: dataProfileEkin?.atasan.nik,
                  },
                })
              }
            >
              <Image
                source={require('../../../../assets/image/edit.png')}
                className="mx-3 size-14"
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>

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
          {renderField('Jabatan', dataProfileEkin?.jabatan)}
          {renderField('Pangkat', dataProfileEkin?.pangkat)}
          {renderField('Golongan', dataProfileEkin?.golongan)}
          {renderField(
            'Eselon',
            dataProfileEkin?.detail_pegawai.data.nama_eselon
          )}
          {renderField('Atasan', dataProfileEkin?.atasan.nama)}
          {renderField('Status Pegawai', user.data.nama_jenis_pegawai)}
        </View>
      </View>
    </ScrollView>
  );
}
