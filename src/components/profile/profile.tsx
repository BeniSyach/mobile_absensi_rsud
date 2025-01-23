import { Env } from '@env';
import { Link } from 'expo-router';

import { type GetUserDetailResponse } from '@/api';
import { Image, Pressable, Text, View } from '@/components/ui';

import { ProfileDetails } from './profile-details';

export default function ProfileCard({ user }: { user: GetUserDetailResponse }) {
  return (
    <View className="mx-auto mt-2 max-w-lg rounded-lg bg-white p-6 shadow-md">
      {/* Foto Profil */}
      <View className="mb-4 flex items-center justify-center">
        <Link href="/setting-app/upload-foto" asChild>
          <Pressable>
            <Image
              source={{
                uri: user.photo
                  ? `${Env.API_URL}/storage/${user.photo}`
                  : 'https://dummyimage.com/80x80',
              }}
              className="size-32 rounded-full border-4 border-gray-200"
            />
          </Pressable>
        </Link>
      </View>

      {/* Nama Pengguna */}
      <Text className="dark:text-dark-500 mb-2 text-center text-2xl font-semibold text-gray-900">
        {user.name}
      </Text>

      {/* Email Pengguna */}
      <Text className="dark:text-dark-500 mb-2 text-center text-sm text-gray-600">
        {user.email}
      </Text>

      <ProfileDetails message={user} />
    </View>
  );
}
