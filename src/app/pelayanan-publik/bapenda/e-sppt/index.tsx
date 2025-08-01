import { Stack } from 'expo-router';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import FormInputEsppt from '@/components/pelayanan-publik-component/bapenda-component/e-sppt-component/form-input-e-sppt';
import { Image, View } from '@/components/ui';

export default function MenuESppt() {
  return (
    <SafeAreaView className="flex-1 bg-[#2400A4]">
      <StatusBar backgroundColor="#2B1DAC" barStyle="dark-content" />
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
            source={require('../../../../../assets/image/pelayanan-publik/bapenda/icon-header-esppt.png')}
            contentFit="cover"
            className="absolute left-0 top-0 size-full"
          />
        </View>
        <View className="flex-1">
          <FormInputEsppt />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
