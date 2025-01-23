import { Env } from '@env';

import { type AbsenMasukDanPulangByUserResponse } from '@/api';
import { Image, Text, View } from '@/components/ui';

interface CardProps {
  data: AbsenMasukDanPulangByUserResponse; // menerima objek tunggal
}

const AbsenMasuk = ({
  waktuMasuk,
  keterangan,
  photo,
  tpp_in,
}: {
  waktuMasuk: string;
  keterangan: string;
  photo: string;
  tpp_in: string;
}) => (
  <View className="mb-4 flex-row items-start">
    <Image
      source={{
        uri: photo
          ? `${Env.API_URL}/storage/${photo}`
          : `https://dummyimage.com/80x80`, // fallback URL jika photo tidak ada
      }}
      className="mr-4 size-16 rounded-full"
    />
    <View className="flex-1">
      <View className="flex-row items-center">
        <Text className="dark:text-dark-500 w-32 text-sm font-bold text-gray-700">
          Absen Masuk
        </Text>
        <Text className="dark:text-dark-500 flex-1 text-sm text-gray-600">
          : {waktuMasuk || '-'}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="dark:text-dark-500 w-32 text-sm font-bold text-gray-700">
          Keterangan
        </Text>
        <Text className="dark:text-dark-500 flex-1 text-sm text-gray-600">
          : {keterangan || '-'}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="dark:text-dark-500 w-32 text-sm font-bold text-gray-700">
          Status
        </Text>
        <Text className="dark:text-dark-500 flex-1 text-sm text-gray-600">
          : {tpp_in || '-'}
        </Text>
      </View>
    </View>
  </View>
);

const AbsenPulang = ({
  waktuPulang,
  keterangan,
  photo,
  tpp_out,
}: {
  waktuPulang: string;
  keterangan: string;
  photo: string;
  tpp_out: string;
}) => (
  <View className="flex-row items-start">
    <Image
      source={{
        uri: photo
          ? `${Env.API_URL}/storage/${photo}`
          : `https://dummyimage.com/80x80`, // fallback URL jika photo tidak ada
      }}
      className="mr-4 size-16 rounded-full"
    />
    <View className="flex-1">
      <View className="flex-row items-center">
        <Text className="dark:text-dark-500 w-32 text-sm font-bold text-gray-700">
          Absen Pulang
        </Text>
        <Text className="dark:text-dark-500 flex-1 text-sm text-gray-600">
          : {waktuPulang || 'Belum Absen Pulang'}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="dark:text-dark-500 w-32 text-sm font-bold text-gray-700">
          keterangan
        </Text>
        <Text className="dark:text-dark-500 flex-1 text-sm text-gray-600">
          : {keterangan || 'Belum Absen Pulang'}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="dark:text-dark-500 w-32 text-sm font-bold text-gray-700">
          Status
        </Text>
        <Text className="dark:text-dark-500 flex-1 text-sm text-gray-600">
          : {tpp_out || 'Belum Absen Pulang'}
        </Text>
      </View>
    </View>
  </View>
);

export const Card = ({ data }: CardProps) => (
  <View className="dark:bg-dark-500 my-4 rounded-lg bg-white p-4 shadow">
    <AbsenMasuk
      waktuMasuk={data.waktu_masuk}
      keterangan={data.keterangan}
      photo={data.photo}
      tpp_in={data.tpp_in}
    />
    <AbsenPulang
      waktuPulang={data.absen_pulang[0]?.waktu_pulang}
      keterangan={data.absen_pulang[0]?.keterangan}
      photo={data.absen_pulang[0]?.photo}
      tpp_out={data.absen_pulang[0]?.tpp_out}
    />
  </View>
);
