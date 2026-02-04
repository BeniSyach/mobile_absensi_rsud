/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  Modal,
  ScrollView,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckUpdateApp, useCheckPasswordUser } from '@/api';
// import VersionCheck from 'react-native-version-check';
import Footer from '@/components/home/footer';
import MenuUtama from '@/components/home/menu-utama';
import Navbar from '@/components/home/navbar';
import { FocusAwareStatusBar, Image, Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function Feed() {
  const router = useRouter();
  const storedMessage = getMessage();
  const versionCode = DeviceInfo.getBuildNumber();
  const { data, isPending, isError } = useCheckPasswordUser();
  const { data: dataUpdateAndroid, isPending: pendingCheckAndroid } =
    CheckUpdateApp({
      variables: {
        version_code: versionCode,
      },
    });

  useEffect(() => {
    // cek versi update setelah data dari server tersedia
    if (dataUpdateAndroid?.update_required) {
      Alert.alert(
        'Update Required',
        dataUpdateAndroid.message,
        [
          {
            text: 'Update',
            onPress: async () => {
              try {
                // Buka Play Store
                await Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.deliserdang.sehat'
                );
              } catch (error) {
                console.warn('Gagal membuka Play Store:', error);
              } finally {
                // Tutup aplikasi setelah 1 detik agar URL sempat terbuka
                setTimeout(() => {
                  RNExitApp.exitApp();
                }, 1000);
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [dataUpdateAndroid]);

  useEffect(() => {
    if (data && data.password_changed === false) {
      // kalau masih pakai password lama → kasih alert
      Alert.alert(
        'Ganti Password',
        'Anda masih menggunakan password lama. Silakan reset password untuk melanjutkan.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/setting-app/reset-password');
              // ⚠️ pastikan ada file app/reset-password.tsx
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [data, router]);

  // 🔹 Skeleton Error (semua abu-abu)
  if (isError) {
    return (
      <SafeAreaView
        className="flex-1 bg-gray-200"
        edges={['top', 'left', 'right']}
      >
        <View className="h-48 w-full animate-pulse bg-gray-300" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-semibold text-gray-600">
            Gagal memuat data
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ❌ Jangan render konten utama ketika update_required true
  if (dataUpdateAndroid?.update_required) {
    return null;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#0B3880]"
      edges={['top', 'left', 'right']}
    >
      {/* <StatusBar backgroundColor="#0B3880" barStyle="dark-content" /> */}
      <FocusAwareStatusBar hidden={true} />
      {/* 🔹 Loading Modal tetap ditampilkan tapi berada di dalam return */}
      <Modal
        visible={isPending || pendingCheckAndroid}
        transparent
        animationType="fade"
      >
        <View className="flex-1 items-center justify-center bg-black/40">
          <View className="items-center rounded-2xl bg-white px-6 py-8 shadow-lg">
            <ActivityIndicator size="large" color="#0B3880" />
            <Text className="mt-4 text-base font-semibold text-gray-700">
              Memuat data...
            </Text>
          </View>
        </View>
      </Modal>

      <View className="h-48 rounded-b-3xl bg-[#0B3880]">
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
              {storedMessage?.nama ?? ''}
            </Text>
          </View>
          <MenuUtama />
        </ScrollView>
        <Footer />
      </ImageBackground>
    </SafeAreaView>
  );
}
