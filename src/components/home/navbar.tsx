// import { useRouter } from 'expo-router';

import { Text, View } from '@/components/ui';

export default function Navbar() {
  // const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 pt-5">
      <Text className="text-2xl font-bold text-white">Deli Serdang Sehat</Text>
    </View>
  );
}
