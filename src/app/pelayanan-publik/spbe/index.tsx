import { Stack } from 'expo-router';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackSimpeg from '@/components/back-simpeg';
import { Text, View } from '@/components/ui';

export default function MenuSpbe() {
  return (
    <SafeAreaView
      className="flex-1 bg-[#2400A4]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#2400A4" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'SPBE',
          headerBackTitle: 'SPBE',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="mt-5 flex-row items-center justify-end gap-2">
          <BackSimpeg />
        </View>
        <View className="flex-1">
          <View className="absolute bottom-10 self-center rounded-lg border border-yellow-400 bg-yellow-100 px-4 py-2">
            <Text className="font-semibold text-yellow-800">
              🚧 Fitur sedang dikembangkan
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
