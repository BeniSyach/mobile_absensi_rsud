import React from 'react';

import { type ApiResponse } from '@/api';
import { Text, View } from '@/components/ui';

const renderField = (label: string, value: string) => (
  <View className="flex flex-row">
    <Text className=" dark:text-dark-500 w-1/3 text-lg text-gray-600">
      {label}
    </Text>
    <Text className=" dark:text-dark-500 text-lg font-medium text-gray-800">
      : {value}
    </Text>
  </View>
);

export const ProfileDetails = ({ message }: { message: ApiResponse }) => (
  <>
    <View className="flex flex-col space-y-2">
      {renderField('NIK', message.data.nik.toString())}
      {renderField(
        'Alamat',
        message.data.alamat.length > 15
          ? `${message.data.alamat.substring(0, 15)}...`
          : message.data.alamat
      )}
      {renderField(
        'Unit Kerja',
        message.data.nama_unit_kerja.length > 15
          ? `${message.data.nama_unit_kerja.substring(0, 15)}...`
          : message.data.nama_unit_kerja
      )}
      {renderField('Jenis Kelamin', message.data.jenis_kelamin)}
      {renderField('Status Pegawai', message.data.nama_jenis_pegawai)}
    </View>
  </>
);
