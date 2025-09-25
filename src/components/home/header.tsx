import { Env } from '@env';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MMKV } from 'react-native-mmkv';

import { type UserPegawai } from '@/api';
import { Image, Text } from '@/components/ui';

const storage = new MMKV({ id: 'face-auth' });
const FACE_URI_KEY = 'face_photo_uri';

export default function Header({ data }: { data: UserPegawai | null }) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    // Ambil dari MMKV dulu
    const cachedUri = storage.getString(FACE_URI_KEY);
    if (cachedUri) {
      setPhotoUri(cachedUri);
    } else if (data?.photo) {
      // fallback ke API kalau belum ada cache
      setPhotoUri(`${Env.API_URL}/storage/${data.photo}`);
    } else {
      // fallback terakhir → dummy
      setPhotoUri('https://dummyimage.com/80x80');
    }
  }, [data]);

  if (!data) return null;
  if (!data) {
    return null;
  }

  return (
    <Link href="/settings">
      <View className="flex-row items-center rounded-lg bg-[#C9DEFE] p-2 shadow">
        <Image
          source={{ uri: photoUri ?? 'https://dummyimage.com/80x80' }}
          className="mr-4 size-20 rounded-full"
          transition={1000}
          contentFit="cover" // ✅ biar gak gepeng
        />
        <View className="flex-1 p-2">
          <Text className="dark:text-dark-500 text-lg font-bold">
            {data.nama && data.nama.length > 20
              ? `${data.nama.slice(0, 20)}...`
              : data.nama}
          </Text>
          {data.nip && data.nip.toString().trim() !== '0' ? (
            <Text className="dark:text-dark-500 font-semibold text-gray-600">
              {data.nip.toString().length > 20
                ? `${data.nip.toString().slice(0, 20)}...`
                : data.nip}
            </Text>
          ) : null}

          <Text className="dark:text-dark-500 font-semibold text-gray-600">
            {data.nama_unit_kerja && data.nama_unit_kerja.length > 30
              ? `${data.nama_unit_kerja.slice(0, 30)}...`
              : data.nama_unit_kerja}
          </Text>
          <Text className="dark:text-dark-500 font-semibold text-gray-600">
            {data.nama_jenis_pegawai && data.nama_jenis_pegawai.length > 30
              ? `${data.nama_jenis_pegawai.slice(0, 30)}...`
              : data.nama_jenis_pegawai}
          </Text>
        </View>
        {/* <Pressable className="p-2">
        <Image
          source={{ uri: 'https://dummyimage.com/40x40/ff0000/ffffff&text=!' }}
          className="size-10 rounded-full"
        />
        </Pressable> */}
      </View>
    </Link>
  );
}
