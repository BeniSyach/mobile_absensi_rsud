/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native';

import { type ApiResponse } from '@/api';
import { Image, Text, View } from '@/components/ui';

type Props = {
  dataProfileEkin?: ApiResponse | null;
};

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

export default function CardDataPegawaiComponent({ dataProfileEkin }: Props) {
  const route = useRouter();

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
                    id: dataProfileEkin?.data.id,
                    nama: dataProfileEkin?.data.nama,
                    nip: dataProfileEkin?.data.nip,
                    nik: dataProfileEkin?.data.nik,
                    kode_opd: dataProfileEkin?.data.unit_kerja_id,
                    jabatan: dataProfileEkin?.data.jabatan_id,
                    pangkat: dataProfileEkin?.data.pangkat_id,
                    golongan: dataProfileEkin?.data.golongan_ruang_id,
                    eselon: dataProfileEkin?.data.nama_eselon,
                    atasan: dataProfileEkin?.data.atasan_id,
                    kode_eselon: dataProfileEkin?.data.eselon_id,
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

          {renderField('Nama Lengkap', dataProfileEkin?.data.nama)}
          {renderField('NIP', dataProfileEkin?.data.nip)}
          {renderField('NIK', dataProfileEkin?.data.nik)}
          {renderField(
            'Alamat',
            dataProfileEkin?.data.alamat
              ? dataProfileEkin.data.alamat.length > 25
                ? `${dataProfileEkin.data.alamat.substring(0, 25)}...`
                : dataProfileEkin.data.alamat
              : '-'
          )}

          {renderField(
            'Unit Kerja',
            dataProfileEkin?.data.nama_unit_kerja
              ? dataProfileEkin.data.nama_unit_kerja.length > 25
                ? `${dataProfileEkin.data.nama_unit_kerja.substring(0, 25)}...`
                : dataProfileEkin.data.nama_unit_kerja
              : '-'
          )}

          {renderField('Jenis Kelamin', dataProfileEkin?.data.jenis_kelamin)}
          {renderField('Jabatan', dataProfileEkin?.data.nama_jabatan)}
          {renderField('Pangkat', dataProfileEkin?.data.nama_pangkat)}
          {renderField('Golongan', dataProfileEkin?.data.nama_golongan_ruang)}
          {renderField('Eselon', dataProfileEkin?.data.nama_eselon)}
          {renderField('Atasan', dataProfileEkin?.data.nama_atasan)}
          {renderField(
            'Status Pegawai',
            dataProfileEkin?.data.nama_jenis_pegawai
          )}
        </View>
      </View>
    </ScrollView>
  );
}
