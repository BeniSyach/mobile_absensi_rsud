import { Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackSimpeg from '@/components/back-simpeg';
import HeaderSimpeg from '@/components/header-simpeg';
import AddJabatan from '@/components/simpegComponent/jabatan-component/add-jabatan';
import CardJabatan from '@/components/simpegComponent/jabatan-component/card-jabatan';

export default function Jabatan() {
  return (
    <SafeAreaView
      className="flex-1 bg-[#0B3880]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#CBDFFF" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Jabatan Simpeg',
          headerBackTitle: 'Jabatan Simpeg',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../assets/background/background_2.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <BackSimpeg />
        <HeaderSimpeg
          sourceImage={require('../../../../assets/image/jabatan_2.png')}
          judul="JABATAN"
        />
        <ScrollView>
          <CardJabatan />
          <AddJabatan />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
