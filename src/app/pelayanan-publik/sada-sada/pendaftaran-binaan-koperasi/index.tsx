/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { useGetMasterDataUmkm } from '@/api/sada-sada/use-get-master-data';
import FormInputBinaan from '@/components/pelayanan-publik-component/sada-sada-component/pendaftar-binaan-component/form-input';
import {
  FocusAwareStatusBar,
  Image,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

export default function PendaftaranBinaan() {
  const { data, isPending, error } = useGetMasterDataUmkm();
  if (isPending) {
    return (
      <View className="flex-1 justify-center">
        <Stack.Screen
          options={{
            title: 'Pendaftaran Binaan Koperasi',
            headerBackTitle: 'Pendaftaran Binaan Koperasi',
            headerShown: false,
          }}
        />
        <ImageBackground
          source={require('../../../../../assets/image/pelayanan-publik/koperasi/background-sada-sada.png')}
          resizeMode="cover"
          className="flex-1"
        >
          <FocusAwareStatusBar />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} />
          </View>
        </ImageBackground>
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 justify-center">
        <Stack.Screen
          options={{
            title: 'Pendaftaran Binaan Koperasi',
            headerBackTitle: 'Pendaftaran Binaan Koperasi',
            headerShown: false,
          }}
        />
        <ImageBackground
          source={require('../../../../../assets/image/pelayanan-publik/koperasi/background-sada-sada.png')}
          resizeMode="cover"
          className="flex-1"
        >
          <FocusAwareStatusBar />
          <Text className="text-center text-blue-500">
            Error API Dari Master Data
          </Text>
        </ImageBackground>
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-[#91F4F4]">
      <StatusBar backgroundColor="#91F4F4" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Pendaftaran Binaan Koperasi',
          headerBackTitle: 'Pendaftaran Binaan Koperasi',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../../assets/image/pelayanan-publik/koperasi/background-sada-sada.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="items-center justify-center">
            <Image
              source={require('../../../../../assets/image/pelayanan-publik/koperasi/pendaftaran-binaan.png')}
              contentFit="contain"
              className="h-36 w-80"
            />
          </View>
          <FormInputBinaan masterdata={data} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
