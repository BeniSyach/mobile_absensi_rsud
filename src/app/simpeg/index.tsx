import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, RefreshControl, StatusBar } from 'react-native';

import { GetUser } from '@/api';
import Header from '@/components/home/header';
import MenuKeduaSimpeg from '@/components/simpegComponent/menu-kedua-simpeg';
import MenuUtamaSimpeg from '@/components/simpegComponent/menu-utama-simpeg';
import NavbarSimpeg from '@/components/simpegComponent/navbar-simpeg';
import { Title } from '@/components/title';
import { SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import LoadingComponent from '@/components/ui/loading';

export default function Simpeg() {
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
          <Header data={user} />
        </View>
      </View>
      <ImageBackground
        source={require('../../../assets/background/background_home.png')}
        resizeMode="stretch"
        className="flex-1"
      >
        <Title text="Data Diri" className="bg-[#0B3880]" />
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
