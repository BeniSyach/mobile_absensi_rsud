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
  type AciRole,
  type AciUpdateUserPayload,
  type AciUpt,
  getAciRoles,
  getAciUpts,
  getAciUserDetail,
  updateAciUser,
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

const EditUserHeader = ({ router }: { router: any }) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Edit User</Text>
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

    await updateAciUser(token, id, formData);

    setAlertConfig({
      show: true,
      title: 'Sukses',
      message: 'Data user berhasil diperbarui',
      type: 'success',
      onConfirm: () => {
        setAlertConfig((prev: any) => ({ ...prev, show: false }));
        router.back();
      },
    });
  } catch (error: any) {
    console.error('Update user failed', error);

    // Extract detailed error message
    let errorMessage = 'Gagal memperbarui user';

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

const useRoles = (setRoles: any, setLoadingRoles: any) => {
  useEffect(() => {
    const fetchRoles = async () => {
      const token = getItem<string>('aci_token');
      if (!token) return;
      const res = await getAciRoles(token, { per_page: 100 });
      if (res.status === 200) setRoles(res.data);
      setLoadingRoles(false);
    };
    fetchRoles();
  }, [setRoles, setLoadingRoles]);
};

const useUptLists = (setUpts: any, setLoadingLists: any) => {
  useEffect(() => {
    const fetchLists = async () => {
      const token = getItem<string>('aci_token');
      if (!token) return;
      try {
        const uRes = await getAciUpts(token, { per_page: 100 });
        if (uRes.status === 200) setUpts(uRes.data);
      } catch (e) {
        console.error('Failed fetch UPT list', e);
      } finally {
        setLoadingLists(false);
      }
    };
    fetchLists();
  }, [setUpts, setLoadingLists]);
};

const useFetchUserDetail = (id: string, setFormData: any, setLoading: any) => {
  useEffect(() => {
    const fetchUser = async () => {
      const token = getItem<string>('aci_token');
      if (!token || !id) return;
      try {
        const res = await getAciUserDetail(token, id);
        if (res.status === 200) {
          const u = res.data;
          setFormData({
            name: u.name,
            email: u.email,
            no_wa: u.no_wa,
            nik: u.nik || '',
            upt_id: u.upt_id || '',
            roles: u.roles?.[0]?.id || 0,
            password: '',
          });
        }
      } catch (e) {
        console.error('Fetch user detail failed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, setFormData, setLoading]);
};

const useEditUserLogic = (router: any, id: string) => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AciRole[]>([]);
  const [upts, setUpts] = useState<AciUpt[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingLists, setLoadingLists] = useState(true);
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

  useRoles(setRoles, setLoadingRoles);
  useUptLists(setUpts, setLoadingLists);
  useFetchUserDetail(id, setFormData, setLoading);

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
    loadingRoles,
    loadingLists,
    roles,
    upts,
    formData,
    handleChange,
    handleSubmit,
    alertConfig,
  };
};

const GenericPicker = ({
  label,
  options,
  loading,
  selectedValue,
  onSelect,
  placeholder,
}: {
  label: string;
  options: { id: number | string; label: string }[];
  loading: boolean;
  selectedValue: number | string | null;
  onSelect: (value: number | string) => void;
  placeholder: string;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const selectedOption = options.find((o) => o.id === selectedValue);

  return (
    <View className="mb-4">
      <Text className="mb-2 font-medium text-gray-700">{label} *</Text>
      {loading ? (
        <View className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <ActivityIndicator size="small" color="#0066FF" />
        </View>
      ) : (
        <TouchableOpacity
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text
            className={selectedOption ? 'text-[#0B2347]' : 'text-gray-400'}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </TouchableOpacity>
      )}

      {showPicker && (
        <View className="mt-2 rounded-xl border border-gray-200 bg-white">
          <ScrollView className="max-h-60" showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                className="border-b border-gray-100 px-4 py-3"
                onPress={() => {
                  onSelect(opt.id);
                  setShowPicker(false);
                }}
              >
                <Text
                  className={
                    selectedValue === opt.id
                      ? 'font-bold text-[#0066FF]'
                      : 'text-[#0B2347]'
                  }
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
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

const BasicUserInfoFields = ({
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

const SpecialtyRoleFields = ({
  formData,
  roles,
  upts,
  loadingLists,
  handleChange,
}: {
  formData: AciUpdateUserPayload;
  roles: AciRole[];
  upts: AciUpt[];
  loadingLists: boolean;
  handleChange: (
    key: keyof AciUpdateUserPayload,
    value: string | number
  ) => void;
}) => {
  const selectedRole = roles.find((r) => r.id === formData.roles);
  const isUptRole = selectedRole?.name.toLowerCase().includes('upt');

  if (isUptRole) {
    return (
      <GenericPicker
        label="Lokasi UPT"
        placeholder="Pilih UPT"
        loading={loadingLists}
        options={upts.map((u) => ({ id: u.id, label: u.nama_upt }))}
        selectedValue={formData.upt_id as any}
        onSelect={(val) => handleChange('upt_id', val)}
      />
    );
  }

  return null;
};

const EditUserInputFields = ({
  formData,
  roles,
  upts,
  loadingLists,
  handleChange,
}: {
  formData: AciUpdateUserPayload;
  roles: AciRole[];
  upts: AciUpt[];
  loadingLists: boolean;
  handleChange: (
    key: keyof AciUpdateUserPayload,
    value: string | number
  ) => void;
}) => (
  <>
    <BasicUserInfoFields formData={formData} handleChange={handleChange} />
    <SpecialtyRoleFields
      formData={formData}
      roles={roles}
      upts={upts}
      loadingLists={loadingLists}
      handleChange={handleChange}
    />
  </>
);

const EditUserForm = ({
  formData,
  roles,
  upts,
  loadingRoles,
  loadingLists,
  handleChange,
  loading,
  handleSubmit,
}: {
  formData: AciUpdateUserPayload;
  roles: AciRole[];
  upts: AciUpt[];
  loadingRoles: boolean;
  loadingLists: boolean;
  handleChange: (
    key: keyof AciUpdateUserPayload,
    value: string | number
  ) => void;
  loading: boolean;
  handleSubmit: () => void;
}) => (
  <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
    <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
      <EditUserInputFields
        formData={formData}
        roles={roles}
        upts={upts}
        loadingLists={loadingLists}
        handleChange={handleChange}
      />
      <RolePicker
        roles={roles}
        loadingRoles={loadingRoles}
        selectedRoleId={formData.roles || 0}
        onRoleSelect={(roleId) => handleChange('roles', roleId)}
      />

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

export default function EditUser() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    loading,
    loadingRoles,
    loadingLists,
    roles,
    upts,
    formData,
    handleChange,
    handleSubmit,
    alertConfig,
  } = useEditUserLogic(router, id);

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
      <EditUserHeader router={router} />
      <EditUserForm
        formData={formData}
        roles={roles}
        upts={upts}
        loadingRoles={loadingRoles}
        loadingLists={loadingLists}
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
