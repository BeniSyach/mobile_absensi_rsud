import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

import Footer from '@/components/home/footer';
import MenuUtama from '@/components/home/menu-utama';
import Navbar from '@/components/home/navbar';
import { Image, ScrollView, Text, View } from '@/components/ui';
import { getMessage } from '@/lib';

export default function Feed() {
  const storedMessage = getMessage();
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <View className="h-48 rounded-b-3xl bg-[#0B3880]">
        <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
        <Navbar />
        <View className="items-center justify-center">
          <Image
            source={require('../../../assets/logo_menu_utama.png')}
            style={{ width: 300, height: 100 }}
            contentFit="contain"
            transition={1000}
          />
        </View>
      </View>
      <ImageBackground
        source={require('../../../assets/background/background_home.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="items-center justify-center p-4">
            <Text className="text-xl italic text-black">
              Haloo.... Selamat Datang,{' '}
            </Text>
            <Text className="text-xl font-bold text-black">
              {storedMessage.nama}
            </Text>
          </View>
          <MenuUtama />
        </ScrollView>
        <Footer />
      </ImageBackground>
    </SafeAreaView>
  );
}
