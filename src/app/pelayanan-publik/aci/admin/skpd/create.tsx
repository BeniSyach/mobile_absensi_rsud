import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
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

import { useCreateSkpdLogic } from './use-create-skpd-logic';

const Header = ({ router }: any) => (
  <View className="bg-white px-6 pb-4 pt-12 shadow-sm shadow-gray-100">
    <View className="flex-row items-center">
      <TouchableOpacity
        className="mr-4 size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-[#0B2347]">Tambah SKPD</Text>
    </View>
  </View>
);

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: any) => (
  <View className="mb-6">
    <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>
    <TextInput
      className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-[#0B2347] focus:border-[#0066FF] focus:bg-white"
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
    />
  </View>
);

const SubmitButton = ({ loading, onPress }: any) => (
  <TouchableOpacity
    className={`flex-row items-center justify-center rounded-xl py-4 shadow-lg shadow-blue-200 ${loading ? 'bg-blue-400' : 'bg-[#0066FF]'}`}
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
      {loading ? 'Menyimpan...' : 'Simpan SKPD'}
    </Text>
  </TouchableOpacity>
);

const CoordinateInputs = ({ lat, setLat, lng, setLng }: any) => (
  <View className="flex-row gap-3">
    <View className="flex-1">
      <InputField
        label="Latitude"
        placeholder="0.0"
        value={lat}
        onChangeText={setLat}
        keyboardType="numeric"
      />
    </View>
    <View className="flex-1">
      <InputField
        label="Longitude"
        placeholder="0.0"
        value={lng}
        onChangeText={setLng}
        keyboardType="numeric"
      />
    </View>
  </View>
);

const SkpdForm = ({
  code,
  setCode,
  name,
  setName,
  kepala,
  setKepala,
  nip,
  setNip,
  lat,
  setLat,
  lng,
  setLng,
  loading,
  handleSubmit,
}: any) => (
  <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
    <View className="mb-10 rounded-2xl bg-white p-6 shadow-sm shadow-gray-200">
      <InputField
        label="Kode SKPD"
        placeholder="Masukkan kode SKPD"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <InputField
        label="Nama SKPD"
        placeholder="Masukkan nama SKPD"
        value={name}
        onChangeText={setName}
      />
      <InputField
        label="Kepala SKPD"
        placeholder="Nama Kepala SKPD"
        value={kepala}
        onChangeText={setKepala}
      />
      <InputField
        label="NIP Kepala"
        placeholder="NIP Kepala SKPD"
        value={nip}
        onChangeText={setNip}
        keyboardType="numeric"
      />
      <CoordinateInputs lat={lat} setLat={setLat} lng={lng} setLng={setLng} />
      <SubmitButton loading={loading} onPress={handleSubmit} />
    </View>
  </ScrollView>
);

export default function CreateSkpd() {
  const l = useCreateSkpdLogic();
  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <Header router={l.router} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <SkpdForm {...l} />
      </KeyboardAvoidingView>
      <AwesomeAlert
        show={l.alertConfig.show}
        title={l.alertConfig.title}
        message={l.alertConfig.message}
        showConfirmButton
        confirmText="OK"
        confirmButtonColor={
          l.alertConfig.type === 'success' ? '#10B981' : '#EF4444'
        }
        onConfirmPressed={l.alertConfig.onConfirm}
      />
    </View>
  );
}
