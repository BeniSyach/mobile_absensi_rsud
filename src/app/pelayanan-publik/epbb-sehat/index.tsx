/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { type AxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { z } from 'zod';

import Footer from '@/components/home/footer';
import { Image, SafeAreaView, ScrollView, Text, View } from '@/components/ui';

const formatNOP = (value: string) => {
  // ambil angka saja
  const digits = value.replace(/\D/g, '');

  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 7),
    digits.slice(7, 10),
    digits.slice(10, 13),
    digits.slice(13, 17),
    digits.slice(17, 18),
  ];

  return parts.filter(Boolean).join('.');
};

const parseNOP = (nop: string) => {
  const [
    kd_propinsi,
    kd_dati2,
    kd_kecamatan,
    kd_kelurahan,
    kd_blok,
    no_urut,
    kd_jns_op,
  ] = nop.split('.');

  return {
    kd_propinsi,
    kd_dati2,
    kd_kecamatan,
    kd_kelurahan,
    kd_blok,
    no_urut,
    kd_jns_op,
  };
};

/* =========================
   ZOD SCHEMA
========================= */
const searchSchema = z.object({
  nop: z
    .string()
    .regex(
      /^\d{2}\.\d{2}\.\d{3}\.\d{3}\.\d{3}\.\d{4}\.\d{1}$/,
      'Format NOP tidak valid (contoh: 12.10.002.110.200.1023.0)'
    ),
});

type SearchForm = z.infer<typeof searchSchema>;

/* =========================
   SPLASH LOGIC
========================= */
const useSplashLogic = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  const opacity = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -140,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSplash(false);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return { showSplash, opacity, translateY };
};

/* =========================
   SPLASH SCREEN
========================= */
const SplashScreen = ({
  opacity,
  translateY,
}: {
  opacity: Animated.Value;
  translateY: Animated.Value;
}) => (
  <Animated.View
    style={{
      flex: 1,
      opacity,
      transform: [{ translateY }],
    }}
  >
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />

      <ImageBackground
        source={require('../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1 items-center justify-center"
      >
        <Image
          source={require('../../../../assets/image/pelayanan-publik/logo_kab.png')}
          contentFit="contain"
          className="size-52"
        />
        <View className="flex-row items-center">
          <Text className="text-2xl font-extrabold text-black">E-PBB </Text>
          <Text className="text-2xl font-extrabold text-green-500">SEHAT</Text>
        </View>
      </ImageBackground>
    </View>
  </Animated.View>
);

/* =========================
   MAIN PAGE
========================= */
export default function EpbbSehatPage() {
  const { showSplash, opacity, translateY } = useSplashLogic();
  const [isPending, setIsPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showErrorAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      nop: '',
    },
  });

  const onSubmit = async (data: SearchForm) => {
    if (isPending) return;

    console.log('NOP:', data.nop);
    setIsPending(true);

    try {
      const {
        kd_propinsi,
        kd_dati2,
        kd_kecamatan,
        kd_kelurahan,
        kd_blok,
        no_urut,
        kd_jns_op,
      } = parseNOP(data.nop);

      const response = await axios.get(
        'https://bpdsumut-dss.deliserdangkab.go.id/api/mobile/riwayatNOP',
        {
          params: {
            kd_propinsi,
            kd_dati2,
            kd_kecamatan,
            kd_kelurahan,
            kd_blok,
            no_urut,
            kd_jns_op,
          },
        }
      );

      if (response.status === 200 && response.data) {
        router.push({
          pathname: '/pelayanan-publik/epbb-sehat/detail',
          params: {
            data: JSON.stringify(response.data),
            nop: data.nop,
          },
        });
        return;
      }

      showErrorAlert(
        'Data Tidak Ditemukan',
        'NOP tidak terdaftar atau tidak memiliki riwayat'
      );
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      if (axiosError.response) {
        console.error('Response error:', axiosError.response.data);

        showErrorAlert('Gagal', `${axiosError.response.data.message}`);
      } else if (axiosError.request) {
        console.error('No response:', axiosError.request);

        showErrorAlert(
          'Tidak Ada Respons',
          'Server tidak merespons, silakan coba lagi'
        );
      } else {
        console.error('Request error:', axiosError.message);

        showErrorAlert('Kesalahan Permintaan', axiosError.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  if (showSplash) {
    return <SplashScreen opacity={opacity} translateY={translateY} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="light-content" />

      <Stack.Screen
        options={{
          title: 'E-PBB SEHAT',
          headerShown: false,
        }}
      />

      <ImageBackground
        source={require('../../../../assets/background/background_home.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1">
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* HEADER */}
            <View className="mt-10 items-center">
              <Image
                source={require('../../../../assets/image/pelayanan-publik/logo_kab.png')}
                contentFit="contain"
                className="mb-4 size-28"
              />
              <Text className="text-xl font-bold text-black">
                SELAMAT DATANG DI E-PBB
              </Text>
              <Text className="mt-1 text-sm text-gray-700">
                Silakan masukkan NOP Anda
              </Text>
            </View>

            {/* FORM */}
            <View className="mt-14">
              <View className="my-2">
                <Controller
                  control={control}
                  name="nop"
                  render={({ field: { onChange, value } }) => (
                    <View className="mb-2 flex-row items-center rounded-full border border-gray-300 bg-gray-200 px-4 py-3">
                      <Search
                        className="mr-3"
                        size={20}
                        color="black"
                        strokeWidth={2.5}
                      />
                      <TextInput
                        className="flex-1 text-base text-black"
                        placeholder="NOP (Nomor Objek Pajak)"
                        placeholderTextColor="#6B7280"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={(text) => onChange(formatNOP(text))}
                      />
                    </View>
                  )}
                />
                {errors.nop && (
                  <Text className="mb-1 text-sm text-red-600">
                    {errors.nop.message}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
                className="mt-6 self-center"
              >
                <LinearGradient
                  colors={['#4F7DF3', '#1E3A8A']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{
                    height: 48,
                    paddingHorizontal: 48,
                    borderRadius: 24, // height / 2 → FULL ROUND
                    alignItems: 'center',
                    justifyContent: 'center',

                    // Shadow
                    shadowColor: '#1E3A8A',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 8,
                  }}
                >
                  {isPending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-base font-bold text-white">CARI</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Footer />
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertTitle}
          message={alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#1E3A8A"
          onConfirmPressed={() => setShowAlert(false)}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
