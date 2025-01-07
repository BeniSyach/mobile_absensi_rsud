import React, { useEffect, useState } from 'react';

import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import MenuDua from '@/components/home/menu-dua';
import MenuSatu from '@/components/home/menu-satu';
import { Text, View } from '@/components/ui';
import type { UserData } from '@/lib/message-storage';
import { getMessage } from '@/lib/message-storage';

export default function Feed() {
  const [message, setMessage] = useState<UserData | null>(null);

  // Mengambil pesan dari storage ketika komponen dimuat
  useEffect(() => {
    const storedMessage = getMessage();
    if (storedMessage) {
      setMessage(storedMessage);
    }
  }, []);
  return (
    <View className="flex-1 p-4">
      {/* Header */}
      <Header data={message} />
      <View className="my-4 items-center justify-center">
        <Text className="text-dark-500 mb-6 max-w-xs text-center text-lg font-bold">
          Selamat Datang di Aplikasi Absensi RSUD H. Amri Tambunan
        </Text>
      </View>
      {/* Baris 1 */}
      <MenuSatu />
      {/* Baris 2 */}
      <MenuDua />
      {/* Footer */}
      <Footer />
    </View>
  );
}
