import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { Image, View } from '@/components/ui';

export default function NavbarEkin() {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4">
      <Image
        source={require('../../../assets/logo_ekin.png')}
        style={{ width: 250, height: 50 }}
        contentFit="contain"
      />

      <View className="flex-row items-center justify-end gap-2 ">
        <Image
          source={require('../../../assets/image/notifications.png')}
          className="mx-2 size-9"
          contentFit="contain"
        />
        <Pressable onPress={() => router.back()}>
          <Image
            source={require('../../../assets/image/exit.png')}
            className="mx-3 size-6"
            contentFit="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}
