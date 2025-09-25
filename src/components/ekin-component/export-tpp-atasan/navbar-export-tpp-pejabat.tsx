import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Image } from '@/components/ui';

export default function NavbarExportTPPPejabat() {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-start gap-2 px-4">
      <Pressable onPress={() => router.back()}>
        <Image
          source={require('../../../../assets/image/back.png')}
          className="mx-3 size-10"
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
}
