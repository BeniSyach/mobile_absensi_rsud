import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Text } from '@/components/ui/text';

import { useEditUptLogic } from './use-edit-upt-logic';

const EditUptHeader = ({ router }: { router: any }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Edit UPT</Text>
      <View className="size-10" />
    </View>
  </View>
);

const LoadingView = () => (
  <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
    <ActivityIndicator size="large" color="#0066FF" />
  </View>
);

const EditForm = ({
  name,
  setName,
  submitting,
  handleSubmit,
}: {
  name: string;
  setName: (text: string) => void;
  submitting: boolean;
  handleSubmit: () => void;
}) => (
  <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
    <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
      <View className="mb-4">
        <Text className="mb-2 font-medium text-gray-700">Nama UPT *</Text>
        <TextInput
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-[#0B2347]"
          value={name}
          onChangeText={setName}
          placeholder="Masukkan nama UPT"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <TouchableOpacity
        className={`mt-4 items-center rounded-xl bg-[#0066FF] py-4 shadow-xl shadow-blue-200 ${
          submitting ? 'opacity-70' : ''
        }`}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-bold text-white">
            Simpan Perubahan
          </Text>
        )}
      </TouchableOpacity>
    </View>
  </ScrollView>
);

export default function EditUpt() {
  const {
    name,
    setName,
    loading,
    submitting,
    alertConfig,
    handleSubmit,
    router,
  } = useEditUptLogic();

  if (loading) return <LoadingView />;

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <EditUptHeader router={router} />

      <EditForm
        name={name}
        setName={setName}
        submitting={submitting}
        handleSubmit={handleSubmit}
      />

      <AciAlert {...alertConfig} />
    </View>
  );
}
