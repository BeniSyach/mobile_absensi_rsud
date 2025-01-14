import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl } from 'react-native';

import { GetUser } from '@/api/users';
import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import MenuDua from '@/components/home/menu-dua';
import MenuSatu from '@/components/home/menu-satu';
import { ScrollView, Text, View } from '@/components/ui';
import { getMessage } from '@/lib/message-storage';

export default function Feed() {
  const storedMessage = getMessage();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = GetUser({
    variables: storedMessage?.id,
    enabled: !!storedMessage?.id,
  });
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (storedMessage?.id) {
        refetch(); // Memanggil ulang refetch setiap kali halaman fokus
      }
    }, [storedMessage?.id, refetch]) // Pastikan hanya dipanggil jika id berubah
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (isError || !user) return <Text>Error loading user data</Text>;

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-1 p-4">
        <Header data={user} />
        <View className="my-4 items-center justify-center">
          <Text className="text-dark-500 mb-6 max-w-xs text-center text-lg font-bold">
            Selamat Datang di Aplikasi Absensi RSUD H. Amri Tambunan
          </Text>
        </View>
        <MenuSatu />
        <MenuDua />
        <Footer />
      </View>
    </ScrollView>
  );
}
