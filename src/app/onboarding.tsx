import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView } from 'react-native';

import { FocusAwareStatusBar, Image, Pressable, View } from '@/components/ui';
export default function Onboarding() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <ImageBackground
        source={require('../../assets/background/background_login.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <FocusAwareStatusBar />
        <View className="flex-1 items-center  justify-center">
          <Image
            source={require('../../assets/logo_login.png')}
            className="size-56"
            transition={1000}
            contentFit="contain"
          />

          <Link href="/login" asChild>
            <Pressable>
              <Image
                source={require('../../assets/image/pelayanan_pegawai.png')}
                style={{ width: 300, height: 100 }}
                transition={1000}
                contentFit="contain"
              />
            </Pressable>
          </Link>
          {/* <Link href="/login" asChild>
            <Pressable>
              <Image
                source={require('../../assets/image/pelayanan_pegawai.png')}
                style={{ width: 300, height: 100 }}
                transition={1000}
                contentFit="contain"
              />
            </Pressable>
          </Link>
          <Link href="/login" asChild>
            <Pressable>
              <Image
                source={require('../../assets/image/pelayanan_pegawai.png')}
                style={{ width: 300, height: 100 }}
                transition={1000}
                contentFit="contain"
              />
            </Pressable>
          </Link> */}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
