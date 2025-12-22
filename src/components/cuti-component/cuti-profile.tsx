/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import * as Progress from 'react-native-progress';

import { type UseFaceUserResponse } from '@/api';
import { Image, Text } from '@/components/ui';
import { useAuth } from '@/lib';

type Props = {
  gelarDepan?: string;
  nama: string;
  gelarBelakang?: string;
  isLoading: boolean;
  isError: boolean;
  photo?: UseFaceUserResponse;
};

async function ensureFilePath(localPath: string) {
  const folder = localPath.substring(0, localPath.lastIndexOf('/') + 1);
  const folderInfo = await FileSystem.getInfoAsync(folder);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
  }
}

export const CutiProfile = ({
  gelarDepan,
  nama,
  gelarBelakang,
  photo,
  isError,
  isLoading,
}: Props) => {
  const token = useAuth.getState().token?.access;
  const storage = new MMKV({ id: 'face-auth' });
  const FACE_URI_KEY = 'face_photo_uri';
  const [photoUri, setPhotoUri] = useState<string>(
    'https://dummyimage.com/80x80'
  );

  const maxNamaLength = 27;
  const displayNama =
    nama.length > maxNamaLength ? nama.slice(0, maxNamaLength) + '...' : nama;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isError) {
      // error → dummy image
      setPhotoUri('https://dummyimage.com/80x80');
      return;
    }

    if (photo?.photo_path) {
      // wajah dari API → pakai dan simpan ke MMKV
      setPhotoUri(photo?.photo_path);
      storage.set(FACE_URI_KEY, photo?.photo_path);
    } else {
      // fallback ke cache MMKV
      const cached = storage.getString(FACE_URI_KEY);
      if (cached) {
        setPhotoUri(cached);
      }
    }
  }, [isError, photo, storage]);
  // load foto profil dari server (cache ke lokal)
  useEffect(() => {
    if (isError) return;
    const loadProfilePhoto = async () => {
      if (!photo?.photo_path) {
        setPhotoUri('https://dummyimage.com/80x80');
        return;
      }

      try {
        const remoteUrl = `${Env.API_URL}/absensi/files/faceprint/${photo.photo_path}/view`;
        const localPath =
          FileSystem.cacheDirectory +
          'profile-uploads/' +
          `${photo.photo_path}`;

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
  }, [photo?.photo_path, token, isError]);

  return (
    <View className="items-center rounded-b-3xl bg-[#20A0D8] px-4">
      {/* Foto Profil */}
      <View className="relative">
        <Image
          source={{ uri: photoUri }}
          className="size-32 rounded-full"
          contentFit="cover"
          onProgress={({ loaded, total }) => {
            if (loaded && total) {
              setProgress(loaded / total);
            }
          }}
        />

        {/* Overlay loading */}
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center rounded-full bg-white/60">
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

      {/* Nama & Gelar */}
      <View className="mb-3 mt-2 items-center">
        {gelarDepan && (
          <Text className="text-xl font-bold text-white">{gelarDepan}</Text>
        )}
        <Text className="text-xl font-bold text-white">
          Halo, {displayNama}
        </Text>
        {gelarBelakang && (
          <Text className="text-xl font-bold text-white">{gelarBelakang}</Text>
        )}
      </View>
    </View>
  );
};
