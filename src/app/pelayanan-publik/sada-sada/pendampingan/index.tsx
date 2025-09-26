import { Stack } from 'expo-router';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormInputPendampingan from '@/components/pelayanan-publik-component/sada-sada-component/pendampingan-component/form-input-pendampingan';
import { Image, View } from '@/components/ui';

export default function Pendampingan() {
  return (
    <SafeAreaView
      className="flex-1 bg-[#91F4F4]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#91F4F4" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Pendampingan',
          headerBackTitle: 'Pendampingan',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../../assets/image/pelayanan-publik/koperasi/background-sada-sada.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="items-center justify-center">
          <Image
            source={require('../../../../../assets/image/pelayanan-publik/koperasi/Pendampingan.png')}
            contentFit="contain"
            className="h-36 w-80"
          />
        </View>
        <FormInputPendampingan />
      </ImageBackground>
    </SafeAreaView>
  );
}
