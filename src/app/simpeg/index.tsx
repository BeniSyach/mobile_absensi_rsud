import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import Header from '@/components/home/header';
import MenuKeduaSimpeg from '@/components/simpegComponent/menu-kedua-simpeg';
import MenuUtamaSimpeg from '@/components/simpegComponent/menu-utama-simpeg';
import NavbarSimpeg from '@/components/simpegComponent/navbar-simpeg';
import { Title } from '@/components/title';
import { SafeAreaView, ScrollView, View } from '@/components/ui';
import { getMessage } from '@/lib';

export default function Simpeg() {
  const storedMessage = getMessage();

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Home Simpeg',
          headerBackTitle: 'Home Simpeg',
          headerShown: false,
        }}
      />
      <View className="h-56 rounded-b-3xl bg-[#0B3880]">
        <NavbarSimpeg />
        <View className="mt-5 px-4">
          <Header data={storedMessage} />
        </View>
      </View>
      <ImageBackground
        source={require('../../../assets/background/background_home.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <Title text="Data Diri" className="bg-[#0B3880]" />
        <View className="flex-1">
          <ScrollView className="flex-1">
            <MenuUtamaSimpeg />
          </ScrollView>

          <View className="py-1">
            <MenuKeduaSimpeg />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
