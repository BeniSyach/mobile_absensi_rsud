import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import WebView from 'react-native-webview';

export default function MenuJdih() {
  return (
    <SafeAreaView className="flex-1 bg-[#2400A4]">
      <StatusBar backgroundColor="#2400A4" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'JDIH',
          headerBackTitle: 'JDIH',
          headerShown: true,
        }}
      />
      {/* <ImageBackground
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
      </ImageBackground> */}
      <WebView
        source={{
          uri: 'https://jdih.deliserdangkab.go.id',
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('HTTP error: ', nativeEvent.statusCode);
        }}
      />
    </SafeAreaView>
  );
}
