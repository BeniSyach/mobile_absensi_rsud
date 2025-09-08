/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';

import { type UseFaceUserResponse } from '@/api';
import { Image, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

type Props = {
  gelarDepan?: string;
  nama: string;
  gelarBelakang?: string;
  instansi: string;
  isLoading: boolean;
  isError: boolean;
  photo?: UseFaceUserResponse;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
};

// helper: pastikan folder tujuan ada
async function ensureFilePath(localPath: string) {
  const folder = localPath.substring(0, localPath.lastIndexOf('/') + 1);
  const folderInfo = await FileSystem.getInfoAsync(folder);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
  }
}

export default function ProfileCardAbsensi({
  gelarDepan,
  nama,
  gelarBelakang,
  instansi,
  photo,
  isError,
  isLoading,
}: Props) {
  const token = useAuth.getState().token?.access;
  const [photoUri, setPhotoUri] = useState<string>(
    'https://dummyimage.com/80x80'
  );

  const maxNamaLength = 27;
  const displayNama =
    nama.length > maxNamaLength ? nama.slice(0, maxNamaLength) + '...' : nama;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isError) {
      setPhotoUri('https://dummyimage.com/80x80');
    }
  }, [isError]);
  // load foto profil dari server (cache ke lokal)
  useEffect(() => {
    if (isError) return;
    const loadProfilePhoto = async () => {
      if (!photo?.photo_path) return;

      try {
        const remoteUrl = `${Env.API_URL}/absensi/files/faceprint/${photo.photo_path}/view`;
        const localPath =
          FileSystem.cacheDirectory +
          'profile-uploads/' +
          `${photo.photo_path}.jpg`;

        // pastikan semua folder ada
        await ensureFilePath(localPath);

        // download
        await FileSystem.downloadAsync(remoteUrl, localPath, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // tambahin timestamp biar nggak cache lama
        setPhotoUri(localPath + '?t=' + Date.now());
      } catch (err) {
        console.warn('Gagal load foto profil:', err);
      }
    };

    loadProfilePhoto();
  }, [photo?.photo_path, token]);

  return (
    <View className="flex-row items-center rounded-2xl p-4">
      {/* Info Text */}
      <View className="flex-1">
        {/* Greeting */}
        <Text className="text-sm text-gray-500">{getGreeting()}</Text>

        {/* Gelar Depan */}
        {gelarDepan && (
          <Text className="text-xl font-bold text-[#20A0D8]">{gelarDepan}</Text>
        )}

        {/* Nama */}
        <Text className="text-2xl font-bold text-[#20A0D8]">{displayNama}</Text>

        {/* Gelar Belakang */}
        {gelarBelakang && (
          <Text className="text-xl font-bold text-[#20A0D8]">
            {gelarBelakang}
          </Text>
        )}

        {/* Instansi */}
        <View className="mt-2">
          <Text className="text-md text-black">Instansi:</Text>
          <Text
            className="text-sm font-bold text-gray-700"
            numberOfLines={0} // biar bisa lebih dari 1 baris
          >
            {instansi}
          </Text>
        </View>
      </View>

      {/* Foto Profile */}
      <View className="ml-4 size-36 items-center justify-center">
        <Image
          source={{ uri: photoUri }}
          className="size-36 rounded-full"
          contentFit="cover"
          onProgress={({ loaded, total }) => {
            if (loaded && total) {
              setProgress(loaded / total);
            }
          }}
        />

        {/* Loading overlay (pakai react-query flag) */}
        {isLoading && (
          <View className="absolute size-36 items-center justify-center rounded-full bg-white/60">
            <Progress.Circle
              size={40}
              progress={progress}
              indeterminate={progress === 0}
              color="blue"
            />
            <Text className="mt-1 text-xs text-black">
              {Math.round(progress * 100)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
