import { useRouter } from 'expo-router';
import { KeyRound, LogOut } from 'lucide-react-native';

import { Text, TouchableOpacity, View } from '@/components/ui';
import { useAuth } from '@/lib';

export const ActionButtons = () => {
  const router = useRouter();
  const signOut = useAuth.use.signOut();
  return (
    <View className="mt-4 space-y-4">
      {/* <TouchableOpacity
        onPress={() => router.push('/setting-app/edit-user')}
        className="my-3 flex items-center justify-center rounded-lg bg-blue-500 py-3"
      >
        <Text className="font-semibold text-white">Edit Data</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => router.push('/setting-app/reset-password')}
        className="my-3 flex flex-row items-center justify-center rounded-full bg-[#229BD9] px-4 py-3 shadow-md"
      >
        <KeyRound size={20} color="white" />
        <Text className="ml-2 font-semibold text-white">Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signOut}
        className="my-3 flex flex-row items-center justify-center rounded-full bg-red-500 px-4 py-3 shadow-md"
      >
        <LogOut size={20} color="white" />
        <Text className="ml-2 font-semibold text-white">Logout</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => router.push('/setting-app')}
        className="my-3 flex items-center justify-center rounded-lg bg-gray-500 py-3"
      >
        <Text className="font-semibold text-white">App Settings</Text>
      </TouchableOpacity> */}
    </View>
  );
};
