import { Stack } from 'expo-router';
import { SafeAreaView, StatusBar } from 'react-native';

export default function Cuti() {
  return (
    <SafeAreaView className="flex-1 bg-[#20A0D8]">
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Home Cuti',
          headerBackTitle: 'Home Cuti',
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}
