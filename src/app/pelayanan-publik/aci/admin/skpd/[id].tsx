import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Text } from '@/components/ui/text';

import { useSkpdDetailLogic } from './use-skpd-detail-logic';

const DetailRow = ({ label, value, isLast, onPress }: any) => (
  <View
    className={`flex-row justify-between py-3 ${isLast ? '' : 'border-b border-gray-100'}`}
  >
    <Text className="text-gray-500">{label}</Text>
    {onPress ? (
      <TouchableOpacity onPress={onPress}>
        <Text className="font-medium text-[#0066FF] underline">{value}</Text>
      </TouchableOpacity>
    ) : (
      <Text className="font-medium text-[#0B2347]">{value}</Text>
    )}
  </View>
);

const SkpdInfoCard = ({ skpd, deleting, handleDelete }: any) => (
  <View className="rounded-2xl bg-white p-6 shadow-sm shadow-gray-200">
    <View className="mb-6 items-center">
      <View className="mb-4 size-20 items-center justify-center rounded-full bg-orange-50">
        <Ionicons name="business" size={40} color="#F97316" />
      </View>
      <Text className="text-center text-xl font-bold text-[#0B2347]">
        {skpd.nama_skpd}
      </Text>
    </View>
    <View className="space-y-4">
      <DetailRow label="ID" value={skpd.id} />
      {skpd.kode_skpd && <DetailRow label="Kode SKPD" value={skpd.kode_skpd} />}
      <DetailRow label="Kepala SKPD" value={skpd.kepala_skpd || '-'} />
      <DetailRow label="NIP Kepala" value={skpd.nip_kepala || '-'} />
      <DetailRow
        label="Koordinat"
        value={`${skpd.latitude || 0}, ${skpd.longitude || 0}`}
        onPress={() => {
          if (skpd.latitude && skpd.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${skpd.latitude},${skpd.longitude}`;
            Linking.openURL(url);
          }
        }}
      />
      <DetailRow
        label="Dibuat"
        value={new Date(skpd.created_at).toLocaleString('id-ID')}
      />
      <DetailRow
        label="Update"
        value={new Date(skpd.updated_at).toLocaleString('id-ID')}
        isLast
      />
    </View>
    <TouchableOpacity
      className={`mt-8 flex-row items-center justify-center rounded-xl py-4 ${deleting ? 'bg-red-400' : 'bg-red-500'}`}
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
        {deleting ? 'Menghapus...' : 'Hapus SKPD'}
      </Text>
    </TouchableOpacity>
  </View>
);

const SkpdHeader = ({ router, id }: any) => (
  <View className="bg-white px-6 pb-4 pt-12 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-[#0B2347]">Detail SKPD</Text>
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full bg-blue-50"
        onPress={() =>
          router.push(`/pelayanan-publik/aci/admin/skpd/edit/${id}`)
        }
      >
        <Ionicons name="create-outline" size={20} color="#0066FF" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function SkpdDetail() {
  const { skpd, loading, deleting, handleDelete, router, id, alertConfig } =
    useSkpdDetailLogic();
  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  if (!skpd) return null;
  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <SkpdHeader router={router} id={id} />
      <ScrollView className="flex-1 px-6 pt-6">
        <SkpdInfoCard {...{ skpd, deleting, handleDelete }} />
      </ScrollView>
      <AciAlert {...alertConfig} />
    </View>
  );
}
