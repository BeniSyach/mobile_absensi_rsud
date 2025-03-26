// import { useRouter } from 'expo-router';

import { Text, View } from '@/components/ui';

export default function Navbar() {
  // const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 pt-5">
      <Text className="text-2xl font-bold text-white">Deli Serdang Sehat</Text>

      <View className="flex-row items-center justify-end gap-2 ">
        {/* <Image
          source={require('../../../assets/image/notifications.png')}
          className="mx-2 size-9"
          contentFit="contain"
        /> */}
        {/* <Pressable onPress={() => router.back()}>
          <Image
            source={require('../../../assets/image/exit.png')}
            className="mx-3 size-6"
          />
        </Pressable> */}
      </View>
    </View>
  );
}
