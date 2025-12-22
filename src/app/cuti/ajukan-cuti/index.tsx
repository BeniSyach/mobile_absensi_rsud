import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardAjukanCuti from '@/components/cuti-component/ajukan-cuti-component/dashboard-ajukan-cuti';
import FormAjukanCuti from '@/components/cuti-component/ajukan-cuti-component/form-ajukan-cuti';
import { CutiNavbar } from '@/components/cuti-component/cuti-navbar';

export default function AjukanCuti() {
  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#20A0D8" barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Ajukan Cuti',
          headerBackTitle: 'Ajukan Cuti',
          headerShown: false,
        }}
      />
      <CutiNavbar title="Pengajuan Cuti" />
      <DashboardAjukanCuti />
      <FormAjukanCuti />
    </SafeAreaView>
  );
}
