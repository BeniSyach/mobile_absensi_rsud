import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Footer from '@/components/home/footer';
import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { AciLoginModal } from '@/components/pelayanan-publik-component/aci/login-modal';
import { Image, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { getItem } from '@/lib/storage'; // Added import

// Added import
import { useLoginLogic } from './use-login-logic';

const useSplashLogic = (router: any) => {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const token = getItem('aci_token');

    if (token) {
      const user = getItem<any>('aci_user');
      const userRoles =
        user?.roles?.map((r: any) => r.name.toUpperCase()) || [];
      const isAdminRole = userRoles.some(
        (role: string) => role !== 'MASYARAKAT' && role !== ''
      );

      if (isAdminRole) {
        router.replace('/pelayanan-publik/aci/admin/dashboard');
      } else {
        router.replace('/pelayanan-publik/aci/dashboard');
      }
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  return showSplash;
};

const SplashScreen = () => (
  <View className="relative flex-1 bg-white">
    <Stack.Screen options={{ headerShown: false }} />
    <StatusBar hidden />
    <Image
      source={require('../../../../assets/image/pelayanan-publik/aci/splash-screen.png')}
      className="size-full"
      contentFit="cover"
    />
    <View className="absolute bottom-40 w-full items-center justify-center">
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  </View>
);

export default function AciPage() {
  const router = useRouter();
  const { alertConfig, ...loginProps } = useLoginLogic();
  const showSplash = useSplashLogic(router);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'ACI',
          headerBackTitle: 'ACI',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/image/pelayanan-publik/aci/bg-aci.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1">
          <ScrollView className="flex-1">
            <View className="mt-8 flex-row items-center gap-4 px-4">
              <TouchableOpacity
                className="size-12 items-center justify-center rounded-full bg-white shadow-sm"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-black shadow-none">
                Kembali
              </Text>
            </View>
          </ScrollView>
          <Footer />
          <AciLoginModal {...loginProps} />
        </View>
      </ImageBackground>
      <AciAlert {...alertConfig} />
    </SafeAreaView>
  );
}
