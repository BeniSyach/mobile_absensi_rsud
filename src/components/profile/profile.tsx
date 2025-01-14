import { Env } from '@env';
import React, { useEffect, useState } from 'react';

import { type GetUserDetailResponse } from '@/api';
import { Image, Text, View } from '@/components/ui';
import { getMessage, type UserData } from '@/lib/message-storage';

import { ProfileDetails } from './profile-details';

export default function ProfileCard({ user }: { user: GetUserDetailResponse }) {
  const [message, setMessage] = useState<UserData | null>(null);

  // Mengambil pesan dari storage ketika komponen dimuat
  useEffect(() => {
    const storedMessage = getMessage();
    if (storedMessage) {
      setMessage(storedMessage); // Menyimpan data pesan
    }
  }, []);

  // Jika message masih null, tampilkan loading atau pesan lainnya
  if (!message) {
    return (
      <View className="rounded-lg bg-white p-4 shadow">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="mx-auto mt-2 max-w-lg rounded-lg bg-white p-6 shadow-md">
      {/* Foto Profil */}
      <View className="mb-4 flex items-center justify-center">
        <Image
          source={{
            uri: message.photo
              ? `${Env.API_URL}/storage/${user.photo}`
              : 'https://dummyimage.com/80x80',
          }}
          className="size-32 rounded-full border-4 border-gray-200"
        />
      </View>

      {/* Nama Pengguna */}
      <Text className="mb-2 text-center text-2xl font-semibold text-gray-900">
        {user.name}
      </Text>

      {/* Email Pengguna */}
      <Text className="mb-2 text-center text-sm text-gray-600">
        {user.email}
      </Text>

      <ProfileDetails message={user} />
    </View>
  );
}
