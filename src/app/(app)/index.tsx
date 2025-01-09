import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';

import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import MenuDua from '@/components/home/menu-dua';
import MenuSatu from '@/components/home/menu-satu';
import { ScrollView, Text, View } from '@/components/ui';
import type { UserData } from '@/lib/message-storage';
import { getMessage } from '@/lib/message-storage';

export default function Feed() {
  const [message, setMessage] = useState<UserData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Mengambil pesan dari storage ketika komponen dimuat
  useEffect(() => {
    const storedMessage = getMessage();
    if (storedMessage) {
      setMessage(storedMessage);
    }
  }, []);
  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-1 p-4">
        <Header data={message} />
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
