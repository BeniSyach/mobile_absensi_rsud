import { useRouter } from 'expo-router';
import { ImageBackground, Pressable } from 'react-native';

import { type UserPegawai } from '@/api';
import { Image, Text, View } from '@/components/ui';

interface NavbarEkinProps {
  data: UserPegawai | null;
}

export default function NavbarEkin({ data }: NavbarEkinProps) {
  const router = useRouter();
  if (!data) {
    return null;
  }
  return (
    <ImageBackground
      source={require('../../../assets/image/header_background_ekin.png')}
      resizeMode="cover"
      className="h-[19%] w-full"
    >
      <View className="flex-row items-center justify-between px-4">
        <Image
          source={require('../../../assets/image/icon_ekin.png')}
          style={{ width: 250, height: 80 }}
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
      <View className="px-4">
        <Text className="mt-5 text-lg font-bold text-white">
          Hallo, {data.nama}
        </Text>
        <Text className="text-sm font-bold text-white">
          Instansi : {data.nama_unit_kerja}
        </Text>
      </View>
    </ImageBackground>
  );
}
