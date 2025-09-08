import React from 'react';
import { Dimensions } from 'react-native';

import { type ApiResponse } from '@/api';
import { Text, View } from '@/components/ui';

type ProfileDetailsProps = {
  message?: ApiResponse;
  isLoading: boolean;
  isError: boolean;
};

const screenWidth = Dimensions.get('window').width;

// Misal ambil 60% dari lebar layar untuk teks value
const maxChars = Math.floor(screenWidth * 0.06);

const truncateText = (text: string) => {
  return text.length > maxChars ? text.substring(0, maxChars) + '...' : text;
};

const getJenisKelamin = (jk?: string) => {
  if (jk === 'L') return 'Laki - Laki';
  if (jk === 'P') return 'Perempuan';
  return '-';
};

const renderField = (label: string, value: string) => (
  <View className="my-2 flex flex-row">
    <Text className="dark:text-dark-500 w-1/3 text-lg font-bold text-gray-600">
      {label}
    </Text>
    <Text className="dark:text-dark-500 text-lg font-bold text-gray-800">
      : {truncateText(value)}
    </Text>
  </View>
);

// 🔹 Skeleton Loader
const SkeletonField = () => (
  <View className="my-2 flex flex-row items-center">
    <View className="h-5 w-1/3 animate-pulse rounded-md bg-gray-200" />
    <View className="ml-2 h-5 flex-1 animate-pulse rounded-md bg-gray-200" />
  </View>
);

export const ProfileDetails = ({
  message,
  isLoading,
  isError,
}: ProfileDetailsProps) => {
  if (isLoading) {
    return (
      <View className="items-center justify-center">
        <View className="flex w-full flex-col space-y-2 px-4">
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center justify-center">
        <Text className="font-semibold text-red-500">Gagal memuat data</Text>
      </View>
    );
  }

  if (!message) return null; // jangan render apa2 kalau belum ada user

  return (
    <View className="items-center justify-center">
      <View className="flex flex-col space-y-2">
        {renderField('NIK', message.data.nik?.toString() ?? '-')}
        {renderField('Alamat', message.data.alamat ?? '-')}
        {renderField('Unit Kerja', message.data.nama_unit_kerja ?? '-')}
        {renderField(
          'Jenis Kelamin',
          getJenisKelamin(message.data.jenis_kelamin)
        )}
        {renderField('Status Pegawai', message.data.nama_jenis_pegawai ?? '-')}
      </View>
    </View>
  );
};
