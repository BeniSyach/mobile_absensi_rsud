import React from 'react';

import { type ApiResponse } from '@/api';
import { TitleSecond } from '@/components/title-second';
import { Text, View } from '@/components/ui';

const renderField = (label: string, value: string) => (
  <View className="flex flex-row">
    <Text className=" dark:text-dark-500 text-md w-1/3 text-gray-600">
      {label}
    </Text>
    <Text className=" dark:text-dark-500 text-md font-medium text-gray-800">
      : {value}
    </Text>
  </View>
);

export default function CardLokasiUnit({ message }: { message: ApiResponse }) {
  return (
    <View className="mx-5 my-10 flex flex-col space-y-2 rounded-xl bg-white p-4 shadow">
      <TitleSecond
        text="Data Lokasi Unit"
        className="bg-[#0B3880]"
        statusEdit={false}
        renderForm={() => <></>}
        // renderForm={() => (
        //   <FormLokasiUnit
        //     onSubmit={onSubmit}
        //     isPending={isPending}
        //     isError={isError}
        //   />
        // )}
      />
      {renderField('Unit Kerja', message.data.unit_kerja.nama_unit_kerja)}

      {renderField('Jabatan', message.data.jabatan.nama_jabatan)}
    </View>
  );
}
