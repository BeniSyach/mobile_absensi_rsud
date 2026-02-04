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

import { useUptDetailLogic } from './use-upt-detail-logic';

const UptDetailHeader = ({
  router,
  onDelete,
  onEdit,
}: {
  router: any;
  onDelete: () => void;
  onEdit: () => void;
}) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Detail UPT</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-blue-50"
          onPress={onEdit}
        >
          <Ionicons name="pencil" size={20} color="#0066FF" />
        </TouchableOpacity>
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-red-50"
          onPress={onDelete}
        >
          <Ionicons name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) => (
  <View className="mb-4 flex-row items-center border-b border-gray-100 pb-4">
    <View className="mr-4 size-10 items-center justify-center rounded-full bg-gray-50">
      <Ionicons name={icon} size={20} color="#4B5563" />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-400">{label}</Text>
      <Text className="text-base font-semibold text-[#0B2347]">{value}</Text>
    </View>
  </View>
);

export default function UptDetail() {
  const { upt, loading, handleDelete, router, id, alertConfig } =
    useUptDetailLogic();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  if (!upt) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <Text>UPT tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <UptDetailHeader
        router={router}
        onDelete={handleDelete}
        onEdit={() => router.push(`/pelayanan-publik/aci/admin/upt/edit/${id}`)}
      />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
          <View className="mb-6 items-center">
            <View className="mb-4 size-20 items-center justify-center rounded-full bg-indigo-50">
              <Ionicons name="business" size={40} color="#6366F1" />
            </View>
            <Text className="text-center text-xl font-bold text-[#0B2347]">
              {upt.nama_upt}
            </Text>
          </View>

          <DetailItem label="Nama UPT" value={upt.nama_upt} icon="text" />
          <DetailItem
            label="ID UPT"
            value={upt.id.toString()}
            icon="finger-print"
          />
          <DetailItem
            label="Tanggal Dibuat"
            value={new Date(upt.created_at).toLocaleString('id-ID')}
            icon="calendar"
          />
          <DetailItem
            label="Terakhir Diupdate"
            value={new Date(upt.updated_at).toLocaleString('id-ID')}
            icon="time"
          />
        </View>
      </ScrollView>
      <AciAlert {...alertConfig} />
    </View>
  );
}
