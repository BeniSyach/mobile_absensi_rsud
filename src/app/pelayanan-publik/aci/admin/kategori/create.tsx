import { Ionicons } from '@expo/vector-icons';
import { Stack, type useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import { Text } from '@/components/ui/text';

import { useCreateKategoriLogic } from './use-create-kategori-logic';

export default function CreateKategori() {
  const { name, setName, loading, alertConfig, handleSubmit, router } =
    useCreateKategoriLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <Header router={router} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6">
          <View className="rounded-2xl bg-white p-6 shadow-sm shadow-gray-200">
            <InputField
              label="Nama Kategori"
              placeholder="Masukkan nama kategori"
              value={name}
              onChangeText={setName}
            />

            <SubmitButton loading={loading} onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
        titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
        messageStyle={{ fontSize: 14, textAlign: 'center' }}
      />
    </View>
  );
}

const Header = ({ router }: { router: ReturnType<typeof useRouter> }) => (
  <View className="bg-white px-6 pb-4 pt-12 shadow-sm shadow-gray-100">
    <View className="flex-row items-center">
      <TouchableOpacity
        className="mr-4 size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-[#0B2347]">Tambah Kategori</Text>
    </View>
  </View>
);

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View className="mb-6">
    <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>
    <TextInput
      className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-[#0B2347] focus:border-[#0066FF] focus:bg-white"
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const SubmitButton = ({
  loading,
  onPress,
}: {
  loading: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className={`flex-row items-center justify-center rounded-xl py-4 shadow-lg shadow-blue-200 ${
      loading ? 'bg-blue-400' : 'bg-[#0066FF]'
    }`}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="white" className="mr-2" />
    ) : (
      <Ionicons
        name="save-outline"
        size={20}
        color="white"
        style={{ marginRight: 8 }}
      />
    )}
    <Text className="font-bold text-white">
      {loading ? 'Menyimpan...' : 'Simpan Kategori'}
    </Text>
  </TouchableOpacity>
);
