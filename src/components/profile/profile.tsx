/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Modal, Platform, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { MMKV } from 'react-native-mmkv';
import * as Progress from 'react-native-progress';

import { type ApiResponse, type UseFaceUserResponse } from '@/api';
import FaceRegisterMobileFaceNet from '@/app/setting-app/upload-foto/camera-capture';
import { Image, Pressable, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

interface Props {
  user?: ApiResponse;
  photo?: UseFaceUserResponse;
  isloading: boolean;
  isErrorAPI: boolean;
}

// Inisialisasi MMKV storage
const storage = new MMKV({
  id: 'face-auth',
});

const FACE_URI_KEY = 'face_photo_uri';
const FACE_EMBED_KEY = 'face_embedding';

export default function ProfileCard({
  // user,
  photo,
  isloading,
  isErrorAPI,
}: Props) {
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>(
    'https://dummyimage.com/80x80'
  );
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [embedding, setEmbedding] = useState<Float32Array | null>(null);
  const [progress, setProgress] = useState(0);

  // const { mutateAsync, isPending, isError } = postFaceRecognition();
  const token = useAuth.getState().token?.access;

  // load foto profil dari server (cache ke lokal)
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!photo?.photo_path) return;

      try {
        const remoteUrl = `${Env.API_URL}/absensi/files/faceprint/${photo.photo_path}/view`;
        const localPath =
          FileSystem.cacheDirectory +
          'profile-uploads/' +
          `${photo.photo_path}.jpg`;

        const folder = localPath.substring(0, localPath.lastIndexOf('/') + 1);
        const folderInfo = await FileSystem.getInfoAsync(folder);
        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
        }

        await FileSystem.downloadAsync(remoteUrl, localPath, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPhotoUri(localPath + '?t=' + Date.now());
      } catch (err) {
        console.warn('Gagal load foto profil:', err);
        setPhotoUri('https://dummyimage.com/80x80');
      }
    };

    loadProfilePhoto();
  }, [photo?.photo_path, token]);

  // load dari MMKV jika sudah ada
  useEffect(() => {
    const savedUri = storage.getString(FACE_URI_KEY);
    const savedEmbedding = storage.getString(FACE_EMBED_KEY);

    if (savedUri) setPhotoUri(savedUri);
    if (savedEmbedding) {
      const arr = JSON.parse(savedEmbedding) as number[];
      setEmbedding(new Float32Array(arr));
    }
  }, []);

  // handle hasil FaceRegisterCPU
  const handleRegister = async (
    faceEmbedding: Float32Array | null,
    capturedUri?: string
  ) => {
    if (faceEmbedding && capturedUri) {
      let localUri = capturedUri;

      // simpan foto di Android secara lokal
      if (Platform.OS === 'android') {
        const fileName = `face_${Date.now()}.jpg`;
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        try {
          await FileSystem.copyAsync({
            from: capturedUri,
            to: newPath,
          });
          localUri = newPath;
          console.log('✅ Foto tersimpan di Android:', localUri);
        } catch (err) {
          console.error('❌ Gagal simpan foto:', err);
        }
      }

      setPhotoUri(localUri);
      setEmbedding(faceEmbedding);
      setShowCamera(false);

      // Simpan ke MMKV
      storage.set(FACE_URI_KEY, localUri);
      storage.set(FACE_EMBED_KEY, JSON.stringify(Array.from(faceEmbedding)));

      console.log('✅ Embedding wajah tersimpan:', faceEmbedding);
      showMessage({
        message: 'Wajah berhasil didaftarkan dan tersimpan lokal',
        type: 'success',
        duration: 5000,
      });
    } else {
      console.log('⚠️ Registrasi gagal / tidak senyum');
      setShowCamera(false);
      showMessage({
        message: 'Gagal mendaftar wajah',
        type: 'danger',
        duration: 5000,
      });
    }
  };

  // const handleUpload = async () => {
  //   if (!photoUri || !embedding) return;

  //   try {
  //     await mutateAsync({
  //       nik: user?.data?.nik ? user.data.nik.toString() : '-',
  //       photos: [
  //         {
  //           uri: photoUri,
  //           type: 'image/jpeg',
  //           name: `face_${Date.now()}.jpg`,
  //         },
  //       ],
  //     });
  //     queryClient.invalidateQueries({ queryKey: ['useFaceRecognition'] });
  //     showMessage({
  //       message: 'Foto wajah berhasil diunggah',
  //       type: 'success',
  //       duration: 7000,
  //     });
  //   } catch (error) {
  //     showMessage({
  //       message: 'Terjadi kesalahan saat upload foto',
  //       type: 'danger',
  //       duration: 7000,
  //     });
  //   }
  // };

  return (
    <View className="mx-auto mt-2 max-w-lg rounded-lg">
      {/* Foto Profil */}
      <View className="mb-4 flex items-center justify-center">
        <Pressable onPress={() => setShowCamera(true)}>
          <Image
            source={{
              uri: isErrorAPI ? 'https://dummyimage.com/80x80' : photoUri,
              headers: { Authorization: `Bearer ${token}` },
            }}
            className="size-40 rounded-full border-4 border-gray-200"
            contentFit="cover"
            onProgress={({ loaded, total }) => {
              if (loaded && total) {
                setProgress(loaded / total);
              }
            }}
          />
          {/* Overlay progress */}
          {isloading && (
            <View className="absolute size-32 items-center justify-center rounded-full bg-white/70">
              <Progress.Circle
                size={50}
                progress={progress}
                indeterminate={progress === 0}
                showsText
                thickness={4}
                color="#20A0D8"
                borderWidth={2}
                unfilledColor="#E5E7EB"
                formatText={() => `${Math.round(progress * 100)}%`}
                textStyle={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 12,
                }}
              />
            </View>
          )}
        </Pressable>

        {/* Modal Kamera */}
        <Modal visible={showCamera} animationType="slide">
          <View className="flex-1 bg-black">
            <TouchableOpacity
              onPress={() => setShowCamera(false)}
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Text
                style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}
              >
                ✕
              </Text>
            </TouchableOpacity>

            <FaceRegisterMobileFaceNet onRegister={handleRegister} />
          </View>
        </Modal>
      </View>

      {/* Tombol Upload
      {photoUri && embedding && (
        <View className="mt-4">
          <Button
            onPress={handleUpload}
            disabled={isPending}
            label={isPending ? 'Mengunggah...' : 'Upload Foto Wajah'}
          />
          {isError && (
            <Text className="mt-2 text-center text-sm text-red-500">
              Gagal upload, coba lagi.
            </Text>
          )}
        </View>
      )} */}
    </View>
  );
}
