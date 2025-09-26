import { Stack } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type ResponseSPM } from '@/api/keuangan';
import DataHasilSp2d from '@/components/pelayanan-publik-component/keuangan-sp2d-component/data-hasil-sp2d';
import FormInputSp2d from '@/components/pelayanan-publik-component/keuangan-sp2d-component/form-input-sp2d';
import { Image } from '@/components/ui';

export default function KeuanganSp2d() {
  const [data, setData] = useState<ResponseSPM>();

  const handleDataFromChild = (data: ResponseSPM) => {
    setData(data);
  };
  return (
    <SafeAreaView
      className="flex-1 bg-[#53B175]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#53B175" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Keuangan SP2D',
          headerBackTitle: 'Keuangan SP2D',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/image/pelayanan-publik/keuangan/background_sipantau.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="h-48 rounded-b-3xl bg-[#53B175]">
          {/* Header Section */}
          <View className="my-6 items-center">
            <Image
              source={require('../../../../assets/image/pelayanan-publik/keuangan/header_sp2d.png')}
              contentFit="contain"
              style={{ width: 300, height: 100 }}
            />
          </View>
        </View>
        <View className="m-5">
          <FormInputSp2d dataDiterima={handleDataFromChild} />
        </View>
        {data && <DataHasilSp2d dataResponse={data} />}
      </ImageBackground>
    </SafeAreaView>
  );
}
