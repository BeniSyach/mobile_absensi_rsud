import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormExportTPPPejabat from '@/components/ekin-component/export-tpp-atasan/form-export-tpp-pejabat';
import LogoExportTPPPejabat from '@/components/ekin-component/export-tpp-atasan/logo-export-tpp-pejabat';
import NavbarExportTPPPejabat from '@/components/ekin-component/export-tpp-atasan/navbar-export-tpp-pejabat';
import ViewTPPPejabat from '@/components/ekin-component/export-tpp-atasan/view-tpp-pejabat';

export default function ExportTppPejabatPage() {
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  return (
    <SafeAreaView
      className="flex-1 bg-[#287BDC]"
      edges={['top', 'left', 'right']}
    >
      <StatusBar backgroundColor="#287BDC" barStyle="dark-content" />
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
          <NavbarExportTPPPejabat />
          <LogoExportTPPPejabat />
        </ImageBackground>
        <FormExportTPPPejabat onPreview={(uri) => setPreviewUri(uri)} />

        {previewUri && <ViewTPPPejabat uri={previewUri} />}
      </ImageBackground>
    </SafeAreaView>
  );
}
