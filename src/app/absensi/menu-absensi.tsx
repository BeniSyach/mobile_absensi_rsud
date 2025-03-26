import { Stack } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import { ImageBackground, RefreshControl, StatusBar } from 'react-native';

import { GetUser } from '@/api';
import NavbarAbsensi from '@/components/absensi/navbar-absensi';
import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import MenuDua from '@/components/home/menu-dua';
import MenuSatu from '@/components/home/menu-satu';
import { SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import LoadingComponent from '@/components/ui/loading';

export default function MenuAbsensi() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: user, isLoading, isError } = GetUser();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (isLoading) return <LoadingComponent />;
  if (isError || !user) return <Text>Error loading user data</Text>;

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <Stack.Screen
        options={{
          title: 'Home Absensi',
          headerBackTitle: 'Home Absensi',
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
      <View className="h-64 rounded-b-3xl bg-[#0B3880]">
        <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
        <NavbarAbsensi />
        <View className="mt-10 px-4">
          <Header data={user} />
        </View>
      </View>
      <ImageBackground
        source={require('../../../assets/background/background_home.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
