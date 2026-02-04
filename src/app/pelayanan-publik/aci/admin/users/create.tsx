import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import { Text } from '@/components/ui/text';
import { getItem } from '@/lib/storage';

import {
  type AciCreateUserPayload,
  type AciRole,
  createAciUser,
  getAciRoles,
} from '../../aci-service';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}) => (
  <View className="mb-4">
    <Text className="mb-2 font-medium text-gray-700">{label}</Text>
    <TextInput
      className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-[#0B2347]"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  </View>
);

const CreateUserHeader = ({ router }: { router: any }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Tambah User</Text>
      <View className="size-10" />
    </View>
  </View>
);

const validateForm = (
  formData: AciCreateUserPayload,
  setAlertConfig: React.Dispatch<React.SetStateAction<any>>
) => {
  if (
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.no_wa ||
    !formData.nik ||
    !formData.roles
  ) {
    setAlertConfig({
      show: true,
      title: 'Validasi Gagal',
      message: 'Mohon lengkapi semua field wajib (termasuk Role dan NIK).',
      type: 'error',
      onConfirm: () =>
        setAlertConfig((prev: any) => ({ ...prev, show: false })),
    });
    return false;
  }
  return true;
};

const handleFormSubmit = async ({
  formData,
  setLoading,
  setAlertConfig,
  router,
}: {
  formData: AciCreateUserPayload;
  setLoading: (value: boolean) => void;
  setAlertConfig: React.Dispatch<React.SetStateAction<any>>;
  router: any;
}) => {
  if (!validateForm(formData, setAlertConfig)) return;

  try {
    setLoading(true);
    const token = getItem<string>('aci_token');
    if (!token) {
      Alert.alert('Error', 'Sesi kadaluarsa');
      return;
    }

    await createAciUser(token, formData);

    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'User berhasil ditambahkan',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((prev: any) => ({ ...prev, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Create user failed', error);

    // Extract detailed error message
    let errorMessage = 'Gagal menambahkan user';

    if (error?.response?.data) {
      const errorData = error.response.data;

      // Check if there are validation errors
      if (errorData.errors) {
        const errors = Object.values(errorData.errors).flat();
        errorMessage = errors.join('\n');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }

    setAlertConfig({
      show: true,
      title: 'Error',
      message: errorMessage,
      type: 'error',
      onConfirm: () =>
        setAlertConfig((prev: any) => ({ ...prev, show: false })),
    });
  } finally {
    setLoading(false);
  }
};

const useCreateUserLogic = (router: any) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<AciRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [formData, setFormData] = useState<AciCreateUserPayload>({
    name: '',
    email: '',
    password: '',
    no_wa: '',
    nik: '',
    upt_id: '',
    roles: 0,
  });

  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = getItem<string>('aci_token');
        if (!token) return;

        const response = await getAciRoles(token, { per_page: 100 });
        if (response.status === 200) {
          setRoles(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch roles', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (
    key: keyof AciCreateUserPayload,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    handleFormSubmit({ formData, setLoading, setAlertConfig, router });
  };

  return {
    loading,
    loadingRoles,
    roles,
    formData,
    handleChange,
    handleSubmit,
    alertConfig,
  };
};

const RolePicker = ({
  roles,
  loadingRoles,
  selectedRoleId,
  onRoleSelect,
}: {
  roles: AciRole[];
  loadingRoles: boolean;
  selectedRoleId: number;
  onRoleSelect: (roleId: number) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  return (
    <View className="mb-4">
      <Text className="mb-2 font-medium text-gray-700">Role *</Text>
      {loadingRoles ? (
        <View className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <ActivityIndicator size="small" color="#0066FF" />
        </View>
      ) : (
        <TouchableOpacity
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text className={selectedRole ? 'text-[#0B2347]' : 'text-gray-400'}>
            {selectedRole ? selectedRole.name : 'Pilih Role'}
          </Text>
        </TouchableOpacity>
      )}

      {showPicker && (
        <View className="mt-2 rounded-xl border border-gray-200 bg-white">
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              className="border-b border-gray-100 px-4 py-3"
              onPress={() => {
                onRoleSelect(role.id);
                setShowPicker(false);
              }}
            >
              <Text
                className={
                  selectedRoleId === role.id
                    ? 'font-bold text-[#0066FF]'
                    : 'text-[#0B2347]'
                }
              >
                {role.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

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
      <Text className="text-base font-bold text-white">Simpan User</Text>
    )}
  </TouchableOpacity>
);

const UserInputFields = ({
  formData,
  handleChange,
}: {
  formData: AciCreateUserPayload;
  handleChange: (
    key: keyof AciCreateUserPayload,
    value: string | number
  ) => void;
}) => (
  <>
    <InputField
      label="Nama Lengkap *"
      value={formData.name}
      onChangeText={(text) => handleChange('name', text)}
      placeholder="Masukkan nama lengkap"
    />
    <InputField
      label="Email *"
      value={formData.email}
      onChangeText={(text) => handleChange('email', text)}
      placeholder="Masukkan email"
      keyboardType="email-address"
    />
    <InputField
      label="Password *"
      value={formData.password}
      onChangeText={(text) => handleChange('password', text)}
      placeholder="Masukkan password"
      secureTextEntry
    />
    <InputField
      label="Nomor WhatsApp *"
      value={formData.no_wa}
      onChangeText={(text) => handleChange('no_wa', text)}
      placeholder="Contoh: 08123456789"
      keyboardType="phone-pad"
    />
    <InputField
      label="NIK *"
      value={formData.nik}
      onChangeText={(text) => handleChange('nik', text)}
      placeholder="Masukkan NIK (16 digit)"
      keyboardType="numeric"
    />
    <InputField
      label="UPT ID (Opsional)"
      value={formData.upt_id?.toString() || ''}
      onChangeText={(text) => handleChange('upt_id', text)}
      placeholder="Masukkan UPT ID"
      keyboardType="numeric"
    />
  </>
);

const CreateUserForm = ({
  formData,
  roles,
  loadingRoles,
  handleChange,
  loading,
  handleSubmit,
}: {
  formData: AciCreateUserPayload;
  roles: AciRole[];
  loadingRoles: boolean;
  handleChange: (
    key: keyof AciCreateUserPayload,
    value: string | number
  ) => void;
  loading: boolean;
  handleSubmit: () => void;
}) => (
  <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
    <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
      <UserInputFields formData={formData} handleChange={handleChange} />
      <RolePicker
        roles={roles}
        loadingRoles={loadingRoles}
        selectedRoleId={formData.roles}
        onRoleSelect={(roleId) => handleChange('roles', roleId)}
      />
      <SubmitButton loading={loading} onPress={handleSubmit} />
    </View>
    <View className="h-10" />
  </ScrollView>
);

export default function CreateUser() {
  const router = useRouter();
  const {
    loading,
    loadingRoles,
    roles,
    formData,
    handleChange,
    handleSubmit,
    alertConfig,
  } = useCreateUserLogic(router);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <CreateUserHeader router={router} />
      <CreateUserForm
        formData={formData}
        roles={roles}
        loadingRoles={loadingRoles}
        handleChange={handleChange}
        loading={loading}
        handleSubmit={handleSubmit}
      />

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
