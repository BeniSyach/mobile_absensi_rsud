import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import BackSimpeg from '@/components/back-simpeg';
import Footer from '@/components/home/footer';
import MenuUtamaPelayananPublik from '@/components/pelayanan-publik-component/menu-utama-pelayanan-publik';
import { SafeAreaView, ScrollView, Text, View } from '@/components/ui';

export default function PelayananPublik() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Pelayanan-Publik',
          headerBackTitle: 'Pelayanan-Publik',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1">
          <ScrollView className="flex-1">
            <View className="mt-5 flex-row items-center justify-end gap-2">
              <BackSimpeg />
            </View>
            <View className="items-center justify-center p-4">
              <Text className="text-xl font-bold italic text-black">
                Selamat Datang di
              </Text>
              <Text className="text-xl font-bold text-[#0B3880]">
                PORTAL PELAYANAN PUBLIK
              </Text>
              <Text className="text-xl font-bold text-[#0B3880]">
                PEMERINTAH KABUPATEN DELI SERDANG
              </Text>
            </View>

            <MenuUtamaPelayananPublik />
          </ScrollView>
          <Footer />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
