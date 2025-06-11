/* eslint-disable max-lines-per-function */
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, View } from 'react-native';

import {
  type HargaKomoditiPasarRataRata,
  useMasterDataKomoditi,
  useMasterDataPasardisperindag,
} from '@/api/disperindag';
import { useDataHariIni } from '@/api/disperindag/get-komoditi-hari-ini';
import DataHariIni from '@/components/pelayanan-publik-component/pihps-component/data-hari-ini-component';
import DataHasilHargaRata from '@/components/pelayanan-publik-component/pihps-component/data-hasil-harga-rata';
import DataHasilPasar from '@/components/pelayanan-publik-component/pihps-component/data-hasil-pasar-component';
import FormInputHargaRata from '@/components/pelayanan-publik-component/pihps-component/form-input-harga-rata-rata';
import FromInputPasar from '@/components/pelayanan-publik-component/pihps-component/form-input-pasar-component';
import TabSwitch from '@/components/pelayanan-publik-component/pihps-component/switch-button-component';
import { Image, Text } from '@/components/ui';

type TabType = 'pasar' | 'rata' | 'hariIni';

export default function MenuPihps() {
  const { data: MasterDataPasar } = useMasterDataPasardisperindag();
  const { data: MasterDataKomoditi } = useMasterDataKomoditi();
  const { data: resData, isPending: pendingHariIni } = useDataHariIni();
  const [selectedTab, setSelectedTab] = useState<TabType>('hariIni');
  const [dataPasarRes, setDataPasar] = useState<HargaKomoditiPasarRataRata[]>(
    []
  );
  const [dataHargaRes, setDataHarga] = useState<HargaKomoditiPasarRataRata[]>(
    []
  );
  const [pendingPasar, setPendingPasar] = useState(false);
  const [pendingHarga, setPendingHarga] = useState(false);
  const handleDataFromChildPasar = (data: HargaKomoditiPasarRataRata[]) => {
    setDataPasar(data);
    setPendingPasar(false);
  };
  const handleDataFromChildHarga = (data: HargaKomoditiPasarRataRata[]) => {
    setDataHarga(data);
    setPendingHarga(false);
  };
  return (
    <ImageBackground
      source={require('../../../../assets/image/pelayanan-publik/disperindag/header-pihps.png')} // Bagian atas (sayuran)
      resizeMode="cover"
      className="flex-1"
    >
      <Image
        source={require('../../../../assets/image/pelayanan-publik/disperindag/logo-disperindag.png')}
        className="ml-5 h-40 w-60"
        contentFit="contain"
      />
      <SafeAreaView className="flex-1">
        <Stack.Screen
          options={{
            title: 'Home Simpeg',
            headerBackTitle: 'Home Simpeg',
            headerShown: false,
          }}
        />

        <ImageBackground
          source={require('../../../../assets/background/background-menu-disperindag.png')}
          resizeMode="stretch"
          className="flex-1 justify-end pt-5"
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 32, paddingTop: 10 }}
          >
            <View className="flex-1 rounded-t-3xl px-4 py-6">
              <Text className="text-center text-lg font-extrabold text-gray-800">
                Harga Pasar Berdasarkan Komoditas
              </Text>
              <Text className="mb-4 text-center text-lg font-extrabold text-green-700">
                Kabupaten Deli Serdang
              </Text>

              <View className="space-y-4">
                <TabSwitch
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />

                {selectedTab === 'pasar' && (
                  <FromInputPasar
                    Pasar={MasterDataPasar ?? []}
                    Komoditas={MasterDataKomoditi ?? []}
                    responseData={handleDataFromChildPasar}
                  />
                )}
                {selectedTab === 'rata' && (
                  <FormInputHargaRata
                    Komoditas={MasterDataKomoditi ?? []}
                    responDataHarga={handleDataFromChildHarga}
                  />
                )}
              </View>
              {selectedTab === 'hariIni' && (
                <DataHariIni
                  Pending={pendingHariIni}
                  dataHariIni={resData || []}
                />
              )}
              {selectedTab === 'pasar' && (
                <DataHasilPasar
                  Pending={pendingPasar}
                  dataPasar={dataPasarRes}
                />
              )}
              {selectedTab === 'rata' && (
                <DataHasilHargaRata
                  Pending={pendingHarga}
                  dataHarga={dataHargaRes}
                />
              )}
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </ImageBackground>
  );
}
