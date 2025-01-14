import { useRouter } from 'expo-router';

import { Text, TouchableOpacity, View } from '@/components/ui';

export const ActionButtons = () => {
  const router = useRouter();
  return (
    <View className="mt-4 space-y-4">
      <TouchableOpacity
        onPress={() => router.push('/setting-app/edit-user')}
        className="my-3 flex items-center justify-center rounded-lg bg-blue-500 py-3"
      >
        <Text className="font-semibold text-white">Edit Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/setting-app/reset-password')}
        className="my-3 flex items-center justify-center rounded-lg bg-yellow-500 py-3"
      >
        <Text className="font-semibold text-white">Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/setting-app')}
        className="my-3 flex items-center justify-center rounded-lg bg-gray-500 py-3"
      >
        <Text className="font-semibold text-white">App Settings</Text>
      </TouchableOpacity>
    </View>
  );
};
