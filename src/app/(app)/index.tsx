/* eslint-disable max-lines-per-function */
import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar } from 'react-native';

// import VersionCheck from 'react-native-version-check';
import Footer from '@/components/home/footer';
import MenuUtama from '@/components/home/menu-utama';
import Navbar from '@/components/home/navbar';
import { Image, ScrollView, Text, View } from '@/components/ui';
import { getMessage } from '@/lib';

export default function Feed() {
  const storedMessage = getMessage();
  // useEffect(() => {
  //   const checkForUpdate = async () => {
  //     try {
  //       const currentVersion = VersionCheck.getCurrentVersion(); // versi dari app lokal
  //       const latestVersion = await VersionCheck.getLatestVersion(); // versi dari Play Store
  //       console.log('currentVersion', currentVersion);
  //       console.log('latestVersion', latestVersion);
  //       const updateNeeded = await VersionCheck.needUpdate({
  //         currentVersion,
  //         latestVersion,
  //       });
  //       console.log('updateNeeded', updateNeeded);
  //       if (updateNeeded?.isNeeded) {
  //         Alert.alert(
  //           'Update Tersedia',
  //           'Versi baru tersedia. Perbarui aplikasi dari Play Store untuk melanjutkan.',
  //           [
  //             {
  //               text: 'Perbarui Sekarang',
  //               onPress: () => Linking.openURL(updateNeeded.storeUrl),
  //             },
  //             {
  //               text: 'Nanti Saja',
  //               style: 'cancel',
  //             },
  //           ]
  //         );
  //       }
  //     } catch (err) {
  //       console.warn('Gagal memeriksa versi:', err);
  //     }
  //   };

  //   checkForUpdate();
  // }, []);
  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="dark-content" />
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
