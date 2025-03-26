import React from 'react';

import { type PnsResponse } from '@/api/simpeg/pns';
import { TitleSecond } from '@/components/title-second';
import { Text, View } from '@/components/ui';
import LoadingComponent from '@/components/ui/loading';

interface PropsPns {
  data: PnsResponse | undefined;
  loading: boolean;
  error: boolean;
}

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

export default function CardDataPns({ data, loading, error }: PropsPns) {
  if (loading) return <LoadingComponent />;

  if (error || !data) {
    return <Text>Error loading user data</Text>; // Bisa diganti dengan komponen lain sesuai kebutuhan
  }

  return (
    <View className="mx-5 my-10 flex flex-col space-y-2 rounded-xl bg-white p-4 shadow">
      <TitleSecond
        text="Data CPNS"
        className="bg-[#0B3880]"
        statusEdit={false}
        renderForm={() => <></>}
        // renderForm={() => (
        //   <FormPns
        //     onSubmit={onSubmit}
        //     isPending={isPending}
        //     isError={isError}
        //   />
        // )}
      />
      {renderField('Nomor SK', data.data.data.nomor_sk_pns)}
      {renderField('Tanggal SK', data.data.data.tgl_sk_pns)}
      {renderField('TMT', data.data.data.tmt_pns)}
      {renderField('Golongan Ruang', data.data.data.golongan_ruang)}
      {renderField('Sumpah', data.data.data.sumpah_jabatan)}
      {renderField('Tahun Sumpah', data.data.data.tahun_sumpah_jabatan)}
      <View className="my-4"></View>
    </View>
  );
}
