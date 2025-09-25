/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Pressable, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { MMKV } from 'react-native-mmkv';
import * as Progress from 'react-native-progress';

import {
  type ApiResponse,
  postFaceRecognition,
  queryClient,
  type UseFaceUserResponse,
} from '@/api';
import FaceRegisterExpoCameraView from '@/app/setting-app/upload-foto/camera-capture';
import { Image, Text } from '@/components/ui';
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
  user,
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

  const { mutateAsync, isPending, isError } = postFaceRecognition();
  const token = useAuth.getState().token?.access;

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

  // load foto profil dari server (cache ke lokal)
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!photo?.photo_path) {
        setPhotoUri('https://dummyimage.com/80x80');
        return;
      }

      if (photo.photo_path) {
        try {
          const remoteUrl = `${Env.API_URL}/absensi/files/faceprint/${photo.photo_path}/view`;
          const localPath =
            FileSystem.cacheDirectory +
            'profile-uploads/' +
            `${photo.photo_path}.jpg`;

          const folder = localPath.substring(0, localPath.lastIndexOf('/') + 1);
          const folderInfo = await FileSystem.getInfoAsync(folder);
          if (!folderInfo.exists) {
            await FileSystem.makeDirectoryAsync(folder, {
              intermediates: true,
            });
          }

          await FileSystem.downloadAsync(remoteUrl, localPath, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setPhotoUri(localPath + '?t=' + Date.now());

          // simpan ke MMKV untuk offline reuse
          storage.set(FACE_URI_KEY, localPath);

          if (photo.embedding) {
            // kalau dari server Float32Array, pastikan stringify dulu
            setEmbedding(photo.embedding);
            storage.set(
              FACE_EMBED_KEY,
              JSON.stringify(Array.from(photo.embedding))
            );
          }
        } catch (err) {
          console.warn('❌ Gagal ambil foto dari server:', err);
          setPhotoUri('https://dummyimage.com/80x80');
        }
      } else {
        // fallback terakhir → dummy
        setPhotoUri('https://dummyimage.com/80x80');
      }
    };

    loadProfilePhoto();
  }, [photo, token]);

  // handle hasil FaceRegisterCPU
  const handleRegister = async (
    faceEmbedding: Float32Array | null,
    capturedUri?: string
  ) => {
    if (faceEmbedding && capturedUri) {
      // simpan foto di Android secara lokal
      const fileName = `face_${Date.now()}.jpg`;
      let newPath = `${FileSystem.documentDirectory}${fileName}`;

      if (Platform.OS === 'android' && !newPath.startsWith('file://')) {
        newPath = 'file://' + newPath;
      }

      try {
        await FileSystem.copyAsync({
          from: capturedUri,
          to: newPath,
        });
        console.log('✅ Foto tersimpan di Android:', newPath);
      } catch (err) {
        console.error('❌ Gagal simpan foto:', err);
      }

      setPhotoUri(newPath);
      setEmbedding(faceEmbedding);
      setShowCamera(false);

      // Simpan ke MMKV
      storage.set(FACE_URI_KEY, newPath);
      storage.set(FACE_EMBED_KEY, JSON.stringify(Array.from(faceEmbedding)));

      Alert.alert(
        'Wajah berhasil didaftarkan',
        'Apakah Anda Yakin mengupload Wajah ini ?',
        [
          {
            text: 'Batal',
            style: 'cancel',
            onPress: async () => {
              // ❌ Hapus foto lokal
              try {
                await FileSystem.deleteAsync(newPath, { idempotent: true });
                console.log('🗑️ Foto lokal dihapus:', newPath);
              } catch (err) {
                console.warn('⚠️ Gagal hapus foto lokal:', err);
              }

              // ❌ Hapus data MMKV
              storage.delete(FACE_URI_KEY);
              storage.delete(FACE_EMBED_KEY);

              setPhotoUri('https://dummyimage.com/80x80');
              setEmbedding(null);
            },
          },
          {
            text: 'OK',
            onPress: () => handleUpload(newPath, faceEmbedding),
          },
        ],
        { cancelable: false }
      );
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

  const handleUpload = async (newPath: any, faceEmbedding: any) => {
    try {
      await mutateAsync({
        nik: user?.data?.nik ? user.data.nik.toString() : '-',
        embedding: faceEmbedding,
        photos: [
          {
            uri: newPath,
            type: 'image/jpeg',
            name: `face_${Date.now()}.jpg`,
          },
        ],
      });
      queryClient.invalidateQueries({ queryKey: ['useFaceRecognition'] });
      showMessage({
        message: 'Foto wajah berhasil diunggah',
        type: 'success',
        duration: 7000,
      });
    } catch (error) {
      showMessage({
        message: 'Terjadi kesalahan saat upload foto',
        type: 'danger',
        duration: 7000,
      });
    }
  };

  return (
    <View className="mx-auto mt-2 max-w-lg rounded-lg">
      {/* Foto Profil */}
      <View className="mb-4 flex items-center justify-center">
        <Pressable
          onPress={() => {
            if (photo?.photo_path === null) {
              setShowCamera(true); // cuma buka kamera kalau photo kosong
            }
          }}
        >
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

            <FaceRegisterExpoCameraView onRegister={handleRegister} />
          </View>
        </Modal>
      </View>
      {isPending && <ActivityIndicator size="large" color="blue" />}
      {isError && (
        <Text style={{ color: 'red' }}>Upload gagal, coba lagi.</Text>
      )}
    </View>
  );
}
