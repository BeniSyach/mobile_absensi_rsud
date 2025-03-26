import { Env } from '@env';
import { Link } from 'expo-router';

import { type ApiResponse } from '@/api';
import { Image, Pressable, Text, View } from '@/components/ui';

import { ProfileDetails } from './profile-details';

export default function ProfileCard({ user }: { user: ApiResponse }) {
  return (
    <View className="mx-auto mt-2 max-w-lg rounded-lg bg-white p-6 shadow-md">
      {/* Foto Profil */}
      <View className="mb-4 flex items-center justify-center">
        <Link href="/setting-app/upload-foto" asChild>
          <Pressable>
            <Image
              source={{
                uri: user.data.photo
                  ? `${Env.API_URL}/storage/${user.data.photo}`
                  : 'https://dummyimage.com/80x80',
              }}
              className="size-32 rounded-full border-4 border-gray-200"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
      </View>

      {/* Nama Pengguna */}
      <Text className="dark:text-dark-500 mb-2 text-center text-2xl font-semibold text-gray-900">
        {user.data.nama}
      </Text>

      {/* Email Pengguna */}
      {user?.data?.nip && user.data.nip.toString().trim() !== '0' ? (
        <Text className="dark:text-dark-500 mb-2 text-center text-sm text-gray-600">
          {user.data.nip}
        </Text>
      ) : null}

      <ProfileDetails message={user} />
    </View>
  );
}
