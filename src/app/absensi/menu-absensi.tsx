import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import NavbarAbsensi from '@/components/absensi/navbar-absensi';
import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import MenuDua from '@/components/home/menu-dua';
import MenuSatu from '@/components/home/menu-satu';
import { SafeAreaView, ScrollView, View } from '@/components/ui';
import { getMessage } from '@/lib';

export default function MenuAbsensi() {
  const storedMessage = getMessage();

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <Stack.Screen
        options={{
          title: 'Home Absensi',
          headerBackTitle: 'Home Absensi',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#0B3880" barStyle="dark-content" />
      <View className="h-64 rounded-b-3xl bg-[#0B3880]">
        <NavbarAbsensi />
        <View className="mt-10 px-4">
          <Header data={storedMessage} />
        </View>
      </View>
      <ImageBackground
        source={require('../../../assets/background/background_home.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 p-4">
            <MenuSatu />
            <MenuDua />
          </View>
        </ScrollView>
        <Footer />
      </ImageBackground>
    </SafeAreaView>
  );
}
