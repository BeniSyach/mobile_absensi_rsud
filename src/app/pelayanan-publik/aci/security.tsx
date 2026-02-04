import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';

import { useSecurityLogic } from './use-security-logic';

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

        <Text className="text-lg font-bold text-white">Keamanan Akun</Text>

        <View className="size-10" />
      </View>
    </View>
  );
};

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  showPassword,
  toggleShowPassword,
}: PasswordInputProps) => (
  <View className="mb-4">
    <Text className="mb-2 font-semibold text-gray-700">{label}</Text>
    <View className="relative">
      <TextInput
        className="rounded-xl border border-gray-300 bg-white p-4 pr-12 text-gray-800"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
        className="absolute right-4 top-4"
        onPress={toggleShowPassword}
      >
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>
    </View>
  </View>
);

const SecurityForm = () => {
  const { form, loading, handleChange, handleUpdate } = useSecurityLogic();

  return (
    <View className="mt-6 px-6">
      <View className="mb-4">
        <Text className="mb-2 font-semibold text-gray-700">Email</Text>
        <TextInput
          className="rounded-xl border border-gray-300 bg-white p-4 text-gray-800"
          value={form.email}
          onChangeText={(t) => handleChange('email', t)}
          placeholder="Email Anda"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <PasswordInput
        label="Password Saat Ini"
        value={form.currentPass}
        onChangeText={(t) => handleChange('currentPass', t)}
        placeholder="Masukkan password saat ini"
        showPassword={form.showCurrent}
        toggleShowPassword={() =>
          handleChange('showCurrent', !form.showCurrent)
        }
      />

      <PasswordInput
        label="Password Baru"
        value={form.newPass}
        onChangeText={(t) => handleChange('newPass', t)}
        placeholder="Masukkan password baru"
        showPassword={form.showNew}
        toggleShowPassword={() => handleChange('showNew', !form.showNew)}
      />

      <View className="mb-6">
        <PasswordInput
          label="Konfirmasi Password Baru"
          value={form.confirmPass}
          onChangeText={(t) => handleChange('confirmPass', t)}
          placeholder="Ulangi password baru"
          showPassword={form.showConfirm}
          toggleShowPassword={() =>
            handleChange('showConfirm', !form.showConfirm)
          }
        />
      </View>

      <TouchableOpacity
        className={`items-center justify-center rounded-xl bg-[#0066FF] py-4 shadow-lg shadow-blue-200 ${loading ? 'opacity-70' : ''}`}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold text-white">Simpan Perubahan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function AciSecurity() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#F8FAFC]">
        <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Header />
          <View className="mt-4 px-6">
            <Text className="text-center text-sm text-gray-500">
              Anda dapat mengubah email dan password akun Anda di sini.
              Kosongkan kolom password jika hanya ingin mengubah email.
            </Text>
          </View>
          <SecurityForm />
        </ScrollView>
      </View>
    </>
  );
}
