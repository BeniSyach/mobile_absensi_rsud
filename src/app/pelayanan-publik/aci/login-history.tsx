import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { getItem } from '@/lib/storage';

import { type AciLoginSession, getAciLoginSessions } from './aci-service';

const Header = () => {
  const router = useRouter();
  return (
    <View className="px-6 pt-6">
      <View className="flex-row items-center justify-between rounded-[40px] bg-[#0066FF] px-6 py-4 shadow-lg shadow-blue-200">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-white shadow-sm"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/pelayanan-publik/aci/profile');
            }
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white">Riwayat Login</Text>

        <View className="size-10" />
      </View>
    </View>
  );
};

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

const SessionItem = ({ item }: { item: AciLoginSession }) => {
  const cleanDevice = stripHtml(item.device);
  return (
    <View className="mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm font-bold text-[#0B2347]">
            Login Berhasil
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            {stripHtml(item.created_at)}
          </Text>
        </View>
        <View className="ml-2 rounded-full bg-blue-50 p-1.5">
          <Ionicons name="key-outline" size={16} color="#0066FF" />
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <View className="flex-row items-center rounded-lg bg-gray-50 px-2 py-1">
          <Ionicons name="globe-outline" size={12} color="#6B7280" />
          <Text className="ml-1 text-[10px] text-gray-600">{item.ip}</Text>
        </View>
        <View className="flex-row items-center rounded-lg bg-gray-50 px-2 py-1">
          <Ionicons name="desktop-outline" size={12} color="#6B7280" />
          <Text className="ml-1 text-[10px] text-gray-600">{item.os}</Text>
        </View>
        {cleanDevice ? (
          <View className="flex-row items-center rounded-lg bg-gray-50 px-2 py-1">
            <Ionicons name="phone-portrait-outline" size={12} color="#6B7280" />
            <Text className="ml-1 text-[10px] text-gray-600">
              {cleanDevice}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default function AciLoginHistory() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AciLoginSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = getItem<string>('aci_token');
        if (!token) {
          router.replace('/pelayanan-publik/aci');
          return;
        }
        const data = await getAciLoginSessions(token);
        if (data && data.data) {
          setSessions(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch login sessions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {loading ? (
        <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : (
        <View className="flex-1 bg-[#F8FAFC]">
          <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
          <Header />

          <FlatList
            data={sessions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <SessionItem item={item} />}
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-gray-400">
                  Belum ada riwayat login tercatat.
                </Text>
              </View>
            }
          />
        </View>
      )}
    </>
  );
}
