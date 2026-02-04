import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';

import {
  type AciCreateRolePayload,
  type AciPermission,
} from '../../aci-service';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
}: InputFieldProps) => (
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

interface CreateRoleFormProps {
  formData: AciCreateRolePayload;
  setFormData: React.Dispatch<React.SetStateAction<AciCreateRolePayload>>;
  allPermissions: AciPermission[];
  loading: boolean;
  onSubmit: () => void;
}

const PermissionSelector = ({
  allPermissions,
  selectedPermissions,
  onToggle,
}: {
  allPermissions: AciPermission[];
  selectedPermissions: number[];
  onToggle: (id: number) => void;
}) => {
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

export const CreateRoleForm = ({
  formData,
  setFormData,
  allPermissions = [],
  loading,
  onSubmit,
}: CreateRoleFormProps) => {
  const handleTogglePermission = (id: number) => {
    setFormData((prev) => {
      const current = [...prev.permissions];
      const index = current.indexOf(id);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(id);
      }
      return { ...prev, permissions: current };
    });
  };

  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
        <InputField
          label="Nama Role *"
          value={formData.name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          placeholder="Contoh: Admin, User, Manager"
        />

        <PermissionSelector
          allPermissions={allPermissions}
          selectedPermissions={formData.permissions}
          onToggle={handleTogglePermission}
        />

        <TouchableOpacity
          className={`mt-4 items-center rounded-xl bg-[#0066FF] py-4 shadow-xl shadow-blue-200 ${
            loading ? 'opacity-70' : ''
          }`}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Simpan Role</Text>
          )}
        </TouchableOpacity>
      </View>
      <View className="h-10" />
    </ScrollView>
  );
};

export default function Ignored() {
  return null;
}
