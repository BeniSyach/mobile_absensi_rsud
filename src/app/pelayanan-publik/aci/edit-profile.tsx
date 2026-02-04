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

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Text } from '@/components/ui/text';

import { useEditProfileLogic } from './use-edit-profile-logic';

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

        <Text className="text-lg font-bold text-white">Ubah Profil</Text>

        <View className="size-10" />
      </View>
    </View>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  icon: any;
  editable?: boolean;
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  icon,
  editable = true,
}: InputFieldProps) => (
  <View className="mb-4">
    <Text className="mb-2 font-semibold text-gray-700">{label}</Text>
    <View className="relative">
      <View className="absolute left-4 top-4 z-10">
        <Ionicons name={icon} size={20} color="#9CA3AF" />
      </View>
      <TextInput
        className={`rounded-xl border border-gray-300 p-4 pl-12 text-gray-800 ${!editable ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  </View>
);

const EditProfileForm = ({ logic }: { logic: any }) => {
  const { loading, formData, handleChange, handleSave } = logic;

  return (
    <View className="mt-6 px-6">
      <InputField
        label="Nama Lengkap"
        value={formData.name}
        onChangeText={(t) => handleChange('name', t)}
        placeholder="Masukkan nama lengkap"
        icon="person-outline"
      />

      <InputField
        label="Email"
        value={formData.email}
        onChangeText={(t) => handleChange('email', t)}
        placeholder="Masukkan Email"
        keyboardType="email-address"
        icon="mail-outline"
      />

      <InputField
        label="Nomor HP / WhatsApp"
        value={formData.no_wa}
        onChangeText={(t) => handleChange('no_wa', t)}
        placeholder="Masukkan nomor HP atau WhatsApp"
        keyboardType="phone-pad"
        icon="logo-whatsapp"
        editable={false}
      />
      <Text className="-mt-3 mb-4 text-xs italic text-gray-400">
        Nomor HP tidak dapat diubah kembali.
      </Text>

      <TouchableOpacity
        className={`mt-4 items-center justify-center rounded-xl bg-[#0066FF] py-4 shadow-lg shadow-blue-200 ${loading ? 'opacity-70' : ''}`}
        onPress={handleSave}
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

export default function AciEditProfile() {
  const logic = useEditProfileLogic();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Header />
        <EditProfileForm logic={logic} />
      </ScrollView>
      <AciAlert
        show={logic.alertConfig.show}
        type={logic.alertConfig.type}
        title={logic.alertConfig.title}
        message={logic.alertConfig.message}
        onConfirm={logic.hideAlert}
      />
    </View>
  );
}
