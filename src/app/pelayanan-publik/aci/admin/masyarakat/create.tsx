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
  createAciMasyarakat,
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

const CreateMasyarakatHeader = ({ router }: { router: any }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">
        Register Masyarakat
      </Text>
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

    await createAciMasyarakat(token, formData);

    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'Masyarakat berhasil didaftarkan',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((prev: any) => ({ ...prev, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Create masyarakat failed', error);

    let errorMessage = 'Gagal mendaftarkan masyarakat';

    if (error?.response?.data) {
      const errorData = error.response.data;

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

const useCreateMasyarakatLogic = (router: any) => {
  const [loading, setLoading] = useState(false);
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
          const masyarakatRole = response.data.find((r) =>
            r.name.toLowerCase().includes('masyarakat')
          );
          if (masyarakatRole) {
            setFormData((prev) => ({ ...prev, roles: masyarakatRole.id }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch roles', error);
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
    formData,
    handleChange,
    handleSubmit,
    alertConfig,
  };
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
      <Text className="text-base font-bold text-white">Simpan Masyarakat</Text>
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
  </>
);

const CreateMasyarakatForm = ({
  formData,
  handleChange,
  loading,
  handleSubmit,
}: {
  formData: AciCreateUserPayload;
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
      <SubmitButton loading={loading} onPress={handleSubmit} />
    </View>
    <View className="h-10" />
  </ScrollView>
);

export default function CreateMasyarakat() {
  const router = useRouter();
  const { loading, formData, handleChange, handleSubmit, alertConfig } =
    useCreateMasyarakatLogic(router);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <CreateMasyarakatHeader router={router} />
      <CreateMasyarakatForm
        formData={formData}
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
