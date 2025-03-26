import { useRouter } from 'expo-router';

import { Image, Pressable, View } from '@/components/ui';

export default function NavbarSKPJAJF() {
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
