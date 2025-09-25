import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, SafeAreaView, View } from 'react-native';

import { FocusAwareStatusBar, Image } from '@/components/ui';

export default function Onboarding() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <ImageBackground
        source={require('../../assets/background/background_login.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center space-y-6 px-6">
          {/* Logo */}
          <Image
            source={require('../../assets/logo_login.png')}
            className="size-40" // 36 * 4 = 144px
            contentFit="contain"
          />

          {/* Pelayanan Publik */}
          <Link href="/pelayanan-publik" asChild>
            <Pressable
              className="overflow-hidden rounded-lg"
              android_ripple={{ color: '#ddd' }}
            >
              <Image
                source={require('../../assets/image/pelayanan_publik.png')}
                className="h-[100px] w-[300px]"
                contentFit="contain"
              />
            </Pressable>
          </Link>

          {/* Pelayanan Pegawai */}
          <Link href="/login" asChild>
            <Pressable
              className="overflow-hidden rounded-lg"
              android_ripple={{ color: '#ddd' }}
            >
              <Image
                source={require('../../assets/image/pelayanan_pegawai.png')}
                className="h-[100px] w-[300px]"
                contentFit="contain"
              />
            </Pressable>
          </Link>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
