import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
  type AciUpdateUserPayload,
  getAciMasyarakatDetail,
  updateAciMasyarakat,
} from '../../../aci-service';

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

const EditMasyarakatHeader = ({ router }: { router: any }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Edit Masyarakat</Text>
      <View className="size-10" />
    </View>
  </View>
);

const validateForm = (
  formData: AciUpdateUserPayload,
  setAlertConfig: React.Dispatch<React.SetStateAction<any>>
) => {
  if (!formData.name || !formData.email || !formData.no_wa) {
    setAlertConfig({
      show: true,
      title: 'Validasi Gagal',
      message: 'Mohon lengkapi semua field wajib.',
      type: 'error',
      onConfirm: () =>
        setAlertConfig((prev: any) => ({ ...prev, show: false })),
    });
    return false;
  }
  return true;
};

const prepareUpdatePayload = (formData: AciUpdateUserPayload) => {
  const payload: any = { ...formData };

  // Handle upt_id: convert empty string to null to avoid backend 500 error
  if (payload.upt_id === '') {
    payload.upt_id = null;
  }

  // Remove password if empty (don't update it)
  if (!payload.password) {
    delete payload.password;
  }

  // Remove roles if 0 (invalid)
  if (payload.roles === 0) {
    delete payload.roles;
  }

  return payload;
};

const getUpdateErrorMessage = (error: any) => {
  if (error?.response?.data) {
    const errorData = error.response.data;
    console.log('Server Error Data:', JSON.stringify(errorData, null, 2));

    if (errorData.errors) {
      const errors = Object.values(errorData.errors).flat();
      return errors.join('\n');
    }
    if (errorData.message) {
      return errorData.message;
    }
  }
  return 'Gagal memperbarui masyarakat';
};

const handleFormSubmit = async ({
  id,
  formData,
  setLoading,
  setAlertConfig,
  router,
}: {
  id: string;
  formData: AciUpdateUserPayload;
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

    const payload = prepareUpdatePayload(formData);
    console.log(
      'Sending Update User Payload:',
      JSON.stringify(payload, null, 2)
    );

    await updateAciMasyarakat(token, id, payload);

    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'Data masyarakat berhasil diperbarui',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((prev: any) => ({ ...prev, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Update masyarakat failed', error);
    setAlertConfig({
      show: true,
      title: 'Error',
      message: getUpdateErrorMessage(error),
      type: 'error',
      onConfirm: () =>
        setAlertConfig((prev: any) => ({ ...prev, show: false })),
    });
  } finally {
    setLoading(false);
  }
};

const useEditMasyarakatData = ({
  id,
  router,
  setFormData,
  setLoading,
}: {
  id: string;
  router: any;
  setFormData: React.Dispatch<React.SetStateAction<AciUpdateUserPayload>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    const fetchMasyarakatData = async (token: string) => {
      const response = await getAciMasyarakatDetail(token, id);
      if (response.status === 200) {
        const user = response.data;
        setFormData({
          name: user.name,
          email: user.email,
          no_wa: user.no_wa,
          nik: user.nik || '',
          upt_id: user.upt_id || '',
          roles: user.roles?.[0]?.id || 0,
          password: '',
        });
      }
    };

    const fetchData = async () => {
      try {
        const token = getItem<string>('aci_token');
        if (!token) return;

        await fetchMasyarakatData(token);
      } catch (error) {
        console.error('Failed to fetch data', error);
        Alert.alert('Error', 'Gagal memuat data');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router, setFormData, setLoading]);
};

const useEditMasyarakatLogic = (router: any, id: string) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<AciUpdateUserPayload>({
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

  useEditMasyarakatData({
    id,
    router,
    setFormData,
    setLoading,
  });

  const handleChange = (
    key: keyof AciUpdateUserPayload,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    handleFormSubmit({ id, formData, setLoading, setAlertConfig, router });
  };

  return {
    loading,
    formData,
    handleChange,
    handleSubmit,
    alertConfig,
  };
};

const EditUserInputFields = ({
  formData,
  handleChange,
}: {
  formData: AciUpdateUserPayload;
  handleChange: (
    key: keyof AciUpdateUserPayload,
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
      label="Password (Biarkan kosong jika tidak ingin ubah)"
      value={formData.password || ''}
      onChangeText={(text) => handleChange('password', text)}
      placeholder="Masukkan password baru"
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
      label="NIK (Opsional)"
      value={formData.nik || ''}
      onChangeText={(text) => handleChange('nik', text)}
      placeholder="Masukkan NIK"
      keyboardType="numeric"
    />
  </>
);

const EditMasyarakatForm = ({
  formData,
  handleChange,
  loading,
  handleSubmit,
}: {
  formData: AciUpdateUserPayload;
  handleChange: (
    key: keyof AciUpdateUserPayload,
    value: string | number
  ) => void;
  loading: boolean;
  handleSubmit: () => void;
}) => (
  <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
    <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
      <EditUserInputFields formData={formData} handleChange={handleChange} />

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
          <Text className="text-base font-bold text-white">
            Simpan Perubahan
          </Text>
        )}
      </TouchableOpacity>
    </View>
    <View className="h-10" />
  </ScrollView>
);

export default function EditMasyarakat() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, formData, handleChange, handleSubmit, alertConfig } =
    useEditMasyarakatLogic(router, id);

  if (loading && !formData.name) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <EditMasyarakatHeader router={router} />
      <EditMasyarakatForm
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
