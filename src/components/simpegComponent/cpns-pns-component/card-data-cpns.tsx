import React from 'react';

import { type CpnsResponse } from '@/api/simpeg/cpns/types';
import { TitleSecond } from '@/components/title-second';
import { Text, View } from '@/components/ui';
import LoadingComponent from '@/components/ui/loading';

interface PropsCpns {
  data: CpnsResponse | undefined;
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

export default function CardDataCpns({ data, loading, error }: PropsCpns) {
  if (loading) return <LoadingComponent />;

  if (error || !data) {
    return <Text>Error loading user data</Text>; // Bisa diganti dengan komponen lain sesuai kebutuhan
  }
  return (
    <View className="mx-5 flex flex-col space-y-2 rounded-xl bg-white p-4 shadow">
      <TitleSecond
        text="Data CPNS"
        className="bg-[#0B3880]"
        statusEdit={false}
        renderForm={() => <></>}
        // renderForm={() => (
        //   <FormCpns
        //     onSubmit={onSubmit}
        //   isPending={isPending}
        //   isError={isError}
        // />
        // {/* )} */}
      />
      {renderField('Nomor SK', data.data.data.nomor_sk_cpns)}
      {renderField('Tanggal SK', data.data.data.tgl_sk_cpns)}
      {renderField('TMT', data.data.data.tmt_cpns)}
      {renderField('Golongan Ruang', data.data.data.golongan_ruang)}
      <View className="my-4"></View>
    </View>
  );
}
