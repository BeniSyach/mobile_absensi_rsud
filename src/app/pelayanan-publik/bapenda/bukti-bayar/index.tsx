import { Stack } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import FormBuktiBayar from '@/components/pelayanan-publik-component/bapenda-component/bukti-bayar-component/form-bukti-bayar';
import { Image, ScrollView, View } from '@/components/ui';

export default function MenuBuktiBayar() {
  return (
    <SafeAreaView className="flex-1 bg-[#2B1DAC]">
      <StatusBar backgroundColor="#2B1DAC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Bukti-Bayar',
          headerBackTitle: 'Bukti-Bayar',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="relative h-60 w-full">
            <Image
              source={require('../../../../../assets/image/pelayanan-publik/bapenda/header_bukti_bayar.png')}
              contentFit="cover"
              className="absolute left-0 top-0 size-full"
            />
          </View>
          <FormBuktiBayar />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
