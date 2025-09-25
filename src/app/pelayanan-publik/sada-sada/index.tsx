import { Link, Stack } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import { Image, Text } from '@/components/ui';

export default function SadaSada() {
  return (
    <SafeAreaView className="flex-1 bg-[#91F4F4]">
      <StatusBar backgroundColor="#91F4F4" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Sada-Sada',
          headerBackTitle: 'Sada-Sada',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/image/pelayanan-publik/koperasi/background-sada-sada.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="my-10 items-center justify-center">
          <Text className="text-center text-2xl font-semibold italic">
            Selamat Datang di
          </Text>
          <Text className="text-center text-xl font-bold">SADA SADA</Text>
          <Text className="text-center text-xl font-bold">DELI SERDANG</Text>
        </View>

        <View className="mt-2 flex-row items-center justify-between px-4">
          <Link href="/pelayanan-publik/sada-sada/data-umkm" asChild>
            <Pressable>
              <Image
                source={require('../../../../assets/image/pelayanan-publik/koperasi/icon-data-umkm.png')}
                className="size-28 rounded-lg"
                transition={1000}
                contentFit="contain"
              />
            </Pressable>
          </Link>
          <Link href="/pelayanan-publik/sada-sada/pendampingan" asChild>
            <Pressable>
              <Image
                source={require('../../../../assets/image/pelayanan-publik/koperasi/icon-pendampingan.png')}
                className="size-28 rounded-lg"
                transition={1000}
                contentFit="contain"
              />
            </Pressable>
          </Link>
          <Link
            href="/pelayanan-publik/sada-sada/pendaftaran-binaan-koperasi"
            asChild
          >
            <Pressable>
              <Image
                source={require('../../../../assets/image/pelayanan-publik/koperasi/icon-pendaftaran-binaan-koperasi.png')}
                className="size-28 rounded-lg"
                transition={1000}
                contentFit="contain"
              />
            </Pressable>
          </Link>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
