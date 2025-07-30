import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';

import FormExportTPP from '@/components/ekin-component/export-tpp/form-export-tpp';
import LogoExportTPP from '@/components/ekin-component/export-tpp/logo-export-tpp';
import NavbarExportTPP from '@/components/ekin-component/export-tpp/navbar-export-tpp';
import ViewTPP from '@/components/ekin-component/export-tpp/view-tpp';
import { SafeAreaView } from '@/components/ui';

export default function ExportTpp() {
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-[#287BDC]">
      <StatusBar backgroundColor="#287BDC" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Home ekin',
          headerBackTitle: 'Home ekin',
          headerShown: false,
        }}
      />

      <ImageBackground
        source={require('../../../../assets/background/dashboard_ekin.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../../assets/image/header_background_ekin.png')}
          resizeMode="cover"
          className="h-[19%] w-full"
        >
          <NavbarExportTPP />
          <LogoExportTPP />
        </ImageBackground>
        <FormExportTPP onPreview={(uri) => setPreviewUri(uri)} />

        {previewUri && <ViewTPP uri={previewUri} />}
      </ImageBackground>
    </SafeAreaView>
  );
}
