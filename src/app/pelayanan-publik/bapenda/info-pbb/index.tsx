import { Stack } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import CariNopComponent from '@/components/pelayanan-publik-component/bapenda-component/info-pbb-component/cari-nop-component';
import { Image, ScrollView, View } from '@/components/ui';

export default function MenuPbb() {
  return (
    <SafeAreaView className="flex-1 bg-[#2B1DAC]">
      <StatusBar backgroundColor="#2B1DAC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Info PBB',
          headerBackTitle: 'Info PBB',
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
              source={require('../../../../../assets/image/pelayanan-publik/bapenda/header-info-pbb.png')}
              contentFit="cover"
              className="absolute left-0 top-0 size-full"
            />
          </View>
          <CariNopComponent />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
