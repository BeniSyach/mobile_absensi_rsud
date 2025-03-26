import React from 'react';

import { type ApiResponse } from '@/api';
import { TitleSecond } from '@/components/title-second';
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

export default function CardDataIdentitas({
  message,
}: {
  message: ApiResponse;
}) {
  return (
    <View className="mx-5 flex flex-col space-y-2 rounded-xl bg-white p-4 shadow">
      <TitleSecond
        text="Data Identitas"
        className="bg-[#0B3880]"
        statusEdit={false}
        renderForm={() => <></>}
        // renderForm={() => (
        //   <FormIdentitas
        //     onSubmit={onSubmit}
        //     isPending={isPending}
        //     isError={isError}
        //   />
        // )}
      />
      {renderField('Nama Lengkap', message.data.nama)}
      {renderField('NIK', message.data.nik.toString())}
      {renderField('NIP', message.data.nip.toString())}
      {renderField('Tempat Lahir', message.data.tempat_lahir)}
      {renderField('Tanggal Lahir', message.data.tanggal_lahir)}
      {renderField(
        'Alamat',
        message.data.alamat.length > 15
          ? `${message.data.alamat.substring(0, 15)}...`
          : message.data.alamat
      )}
      <View className="my-4"></View>
      {renderField('Jenis Kelamin', message.data.jenis_kelamin)}
      {renderField('Agama', message.data.agama.nama_agama)}
      {renderField(
        'Status Pegawai',
        message.data.jenis_pegawai.nama_jenis_pegawai
      )}
      {renderField(
        'Status Perkawinan',
        message.data.status_kawin.nama_status_kawin
      )}
    </View>
  );
}
