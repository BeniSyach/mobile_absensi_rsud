import { Stack } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import FormPadComponent from '@/components/pelayanan-publik-component/bapenda-component/info-pad-component/form-pad-component';
import { Image, View } from '@/components/ui';
export default function MenuPad() {
  return (
    <SafeAreaView className="flex-1 bg-[#2400A4]">
      <StatusBar backgroundColor="#2B1DAC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Info-Pad',
          headerBackTitle: 'Info-Pad',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="relative h-60 w-full">
          <Image
            source={require('../../../../../assets/image/pelayanan-publik/bapenda/header-info-pad.png')}
            contentFit="cover"
            className="absolute left-0 top-0 size-full"
          />
        </View>
        <View className="flex-1">
          <FormPadComponent />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
