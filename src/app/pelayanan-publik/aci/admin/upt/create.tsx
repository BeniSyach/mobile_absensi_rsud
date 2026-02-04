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
import AwesomeAlert from 'react-native-awesome-alerts';

import { Text } from '@/components/ui/text';

import { useCreateUptLogic } from './use-create-upt-logic';

const CreateUptHeader = ({ router }: { router: any }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Tambah UPT Baru</Text>
      <View className="size-10" />
    </View>
  </View>
);

export default function CreateUpt() {
  const { name, setName, loading, alertConfig, handleSubmit, router } =
    useCreateUptLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <CreateUptHeader router={router} />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
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
              loading ? 'opacity-70' : ''
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-bold text-white">Simpan UPT</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AwesomeAlert
        show={alertConfig.show}
        showProgress={false}
        title={alertConfig.title}
        message={alertConfig.message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={
          alertConfig.type === 'success' ? '#10B981' : '#EF4444'
        }
        onConfirmPressed={alertConfig.onConfirm}
        titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
        messageStyle={{ fontSize: 16, textAlign: 'center' }}
      />
    </View>
  );
}
