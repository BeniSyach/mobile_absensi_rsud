import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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

import type { AciPermission, AciUpdateRolePayload } from '../../../aci-service';
import { useEditRoleLogic } from './use-edit-role-logic';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) => (
  <View className="mb-4">
    <Text className="mb-2 font-medium text-gray-700">{label}</Text>
    <TextInput
      className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-[#0B2347]"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
    />
  </View>
);

const EditRoleHeader = ({ router }: { router: any }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Edit Role</Text>
      <View className="size-10" />
    </View>
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
    className={`mt-4 items-center rounded-xl bg-[#0066FF] py-4 shadow-xl shadow-blue-200 ${
      loading ? 'opacity-70' : ''
    }`}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <Text className="text-base font-bold text-white">Simpan Perubahan</Text>
    )}
  </TouchableOpacity>
);

const PermissionSelector = ({
  allPermissions,
  selectedPermissions,
  onToggle,
}: {
  allPermissions: AciPermission[];
  selectedPermissions: number[];
  onToggle: (id: number) => void;
}) => {
  // Group permissions by prefix if applicable (e.g. "user-list" -> "user")
  const groupedPerms = allPermissions.reduce(
    (acc, perm) => {
      const parts = perm.name.split('-');
      const category = parts.length > 1 ? parts[0] : 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(perm);
      return acc;
    },
    {} as Record<string, AciPermission[]>
  );

  return (
    <View className="mb-6">
      <Text className="mb-3 font-medium text-gray-700">Permissions *</Text>
      {Object.keys(groupedPerms).map((category) => (
        <View key={category} className="mb-4">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            {category}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {groupedPerms[category].map((perm) => {
              const isSelected = selectedPermissions.includes(perm.id);
              return (
                <TouchableOpacity
                  key={perm.id}
                  onPress={() => onToggle(perm.id)}
                  className={`rounded-full border px-4 py-2 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {perm.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const EditRoleForm = ({
  formData,
  updateFormField,
  allPermissions,
  loading,
  onSubmit,
}: {
  formData: AciUpdateRolePayload;
  updateFormField: (
    field: keyof AciUpdateRolePayload,
    value: string | number[]
  ) => void;
  allPermissions: AciPermission[];
  loading: boolean;
  onSubmit: () => void;
}) => {
  const handleTogglePermission = (id: number) => {
    const current = [...formData.permissions];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    updateFormField('permissions', current);
  };

  return (
    <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
      <InputField
        label="Nama Role *"
        value={formData.name}
        onChangeText={(text) => updateFormField('name', text)}
        placeholder="Contoh: Admin, User, Manager"
      />

      <PermissionSelector
        allPermissions={allPermissions}
        selectedPermissions={formData.permissions}
        onToggle={handleTogglePermission}
      />

      <SubmitButton loading={loading} onPress={onSubmit} />
    </View>
  );
};

const AlertDialog = ({
  alertConfig,
}: {
  alertConfig: {
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    onConfirm: () => void;
  };
}) => (
  <AwesomeAlert
    show={alertConfig.show}
    showProgress={false}
    title={alertConfig.title}
    message={alertConfig.message}
    closeOnTouchOutside={false}
    closeOnHardwareBackPress={false}
    showConfirmButton={true}
    confirmText="OK"
    confirmButtonColor={alertConfig.type === 'success' ? '#10B981' : '#EF4444'}
    onConfirmPressed={alertConfig.onConfirm}
    titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
    messageStyle={{ fontSize: 16, textAlign: 'center' }}
  />
);

export default function EditRole() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    loading,
    formData,
    allPermissions,
    alertConfig,
    updateFormField,
    handleSubmit,
  } = useEditRoleLogic(id);

  if (loading && !formData.name) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <EditRoleHeader router={router} />
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <EditRoleForm
          formData={formData}
          updateFormField={updateFormField}
          allPermissions={allPermissions}
          loading={loading}
          onSubmit={handleSubmit}
        />
        <View className="h-10" />
      </ScrollView>
      <AlertDialog alertConfig={alertConfig} />
    </View>
  );
}
