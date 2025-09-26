import { Stack } from 'expo-router';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MenuBapendaComponent from '@/components/pelayanan-publik-component/bapenda-component';
import { Image, View } from '@/components/ui';

export default function MenuBapenda() {
  return (
    <SafeAreaView
      className="flex-1 bg-[#2B1DAC]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#2B1DAC" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'E-Padi',
          headerBackTitle: 'E-Padi',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="relative h-60 w-full">
          <Image
            source={require('../../../../assets/image/pelayanan-publik/bapenda/header-bapenda-epadi-fix.png')}
            contentFit="cover"
            className="absolute left-0 top-0 size-full"
          />
        </View>

        <View className="flex-1">
          <MenuBapendaComponent />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
