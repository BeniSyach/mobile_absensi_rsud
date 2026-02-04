import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Text } from '@/components/ui/text';

import { type AciKategori } from '../../aci-service';
import { useKategoriDetailLogic } from './use-kategori-detail-logic';

export default function KategoriDetail() {
  const { kategori, loading, deleting, handleDelete, router, id, alertConfig } =
    useKategoriDetailLogic();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  if (!kategori) return null;

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <Header router={router} id={id} />
      <ScrollView className="flex-1 px-6 pt-6">
        <InfoCard
          kategori={kategori}
          deleting={deleting}
          handleDelete={handleDelete}
        />
      </ScrollView>
      <AciAlert {...alertConfig} />
    </View>
  );
}

const Header = ({
  router,
  id,
}: {
  router: any;
  id: string | string[] | undefined;
}) => (
  <View className="bg-white px-6 pb-4 pt-12 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-[#0B2347]">Detail Kategori</Text>
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full bg-blue-50"
        onPress={() =>
          router.push(`/pelayanan-publik/aci/admin/kategori/edit/${id}`)
        }
      >
        <Ionicons name="create-outline" size={20} color="#0066FF" />
      </TouchableOpacity>
    </View>
  </View>
);

const InfoCard = ({
  kategori,
  deleting,
  handleDelete,
}: {
  kategori: AciKategori;
  deleting: boolean;
  handleDelete: () => void;
}) => (
  <View className="rounded-2xl bg-white p-6 shadow-sm shadow-gray-200">
    <View className="mb-6 items-center">
      <View className="mb-4 size-20 items-center justify-center rounded-full bg-red-50">
        <Ionicons name="list" size={40} color="#DC2626" />
      </View>
      <Text className="text-center text-xl font-bold text-[#0B2347]">
        {kategori.nm_kategori ||
          kategori.nama_kategori ||
          (kategori as any).nama ||
          (kategori as any).name}
      </Text>
    </View>

    <View className="space-y-4">
      <View className="flex-row justify-between border-b border-gray-100 py-3">
        <Text className="text-gray-500">ID</Text>
        <Text className="font-medium text-[#0B2347]">{kategori.id}</Text>
      </View>
      <View className="flex-row justify-between border-b border-gray-100 py-3">
        <Text className="text-gray-500">Dibuat Pada</Text>
        <Text className="font-medium text-[#0B2347]">
          {new Date(kategori.created_at).toLocaleString('id-ID')}
        </Text>
      </View>
      <View className="flex-row justify-between py-3">
        <Text className="text-gray-500">Terakhir Update</Text>
        <Text className="font-medium text-[#0B2347]">
          {new Date(kategori.updated_at).toLocaleString('id-ID')}
        </Text>
      </View>
    </View>

    <TouchableOpacity
      className={`mt-8 flex-row items-center justify-center rounded-xl py-4 ${
        deleting ? 'bg-red-400' : 'bg-red-500'
      }`}
      onPress={handleDelete}
      disabled={deleting}
    >
      {deleting ? (
        <ActivityIndicator color="white" className="mr-2" />
      ) : (
        <Ionicons
          name="trash-outline"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
      )}
      <Text className="font-bold text-white">
        {deleting ? 'Menghapus...' : 'Hapus Kategori'}
      </Text>
    </TouchableOpacity>
  </View>
);
