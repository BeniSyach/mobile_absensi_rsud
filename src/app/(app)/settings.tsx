/* eslint-disable max-lines-per-function */

import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

import { useFaceRecognition } from '@/api';
import { useGetUser } from '@/api/users/get-users';
import ProfileCard from '@/components/profile/profile';
import { ProfileDetails } from '@/components/profile/profile-details';
import { ActionButtons } from '@/components/settings/action-buttons';
import { Text } from '@/components/ui';
import { getMessage } from '@/lib';

export default function Settings() {
  const storedMessage = getMessage();

  const {
    data: user,
    isLoading,
    isError,
  } = useGetUser(storedMessage?.nik ?? '');

  const {
    data: wajah,
    isLoading: loadingWajah,
    isError: errorWajah,
  } = useFaceRecognition({ variables: { nik: storedMessage?.nik ?? '' } });

  const maxNamaLength = 27;
  const displayNama =
    user?.data?.nama && user.data.nama.length > maxNamaLength
      ? user.data.nama.slice(0, maxNamaLength) + '...'
      : (user?.data?.nama ?? '');

  return (
    <SafeAreaView className="flex-1 ">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../../assets/background/background_absensi.png')}
        resizeMode="cover"
        className="flex-1 px-4"
      >
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-4 mt-2 text-2xl font-bold text-[#20A0D8]">
            Profile
          </Text>
          <ProfileCard
            user={user}
            photo={wajah}
            isloading={isLoading || loadingWajah}
            isErrorAPI={isError || errorWajah}
          />
          <View className="items-center">
            {/* Nama Pengguna */}
            {user?.data?.nama_gelar_depan && (
              <Text className="text-center text-xl font-bold text-[#20A0D8]">
                {user.data.nama_gelar_depan}
              </Text>
            )}
            {/* Nama */}
            <Text className="text-center text-2xl font-bold text-[#20A0D8]">
              {displayNama}
            </Text>
            {/* Gelar Belakang */}
            {user?.data?.nama_gelar_belakang && (
              <Text className="text-center text-xl font-bold text-[#20A0D8]">
                {user.data.nama_gelar_belakang}
              </Text>
            )}
            {/* NIP */}
            {user?.data?.nip && user.data.nip.toString().trim() !== '0' ? (
              <Text className="dark:text-dark-500 mb-2 text-center text-sm text-gray-600">
                {user.data.nip}
              </Text>
            ) : null}
          </View>
          <ProfileDetails
            isLoading={isLoading || loadingWajah}
            message={user}
            isError={isError || errorWajah}
          />
          <ActionButtons />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
