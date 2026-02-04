import { Ionicons } from '@expo/vector-icons';
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Text } from '@/components/ui/text';
import { getItem } from '@/lib/storage';

import {
  type AciRole,
  deleteAciRole,
  getAciRoleDetail,
} from '../../aci-service';
import { useAciAlert } from '../../hooks/use-aci-alert';

const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View className="mb-4 flex-row items-center border-b border-gray-100 pb-4">
    <View className="mr-4 size-10 items-center justify-center rounded-full bg-green-50">
      <Ionicons name={icon} size={20} color="#10B981" />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-400">{label}</Text>
      <Text className="text-sm font-semibold text-[#0B2347]">{value}</Text>
    </View>
  </View>
);

const useRoleDetailLogic = (id?: string | string[]) => {
  const [role, setRole] = useState<AciRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const storedToken = getItem<string>('aci_token');
      const roleId = Array.isArray(id) ? id[0] : id;
      if (!storedToken || !roleId) return;

      const response = await getAciRoleDetail(storedToken, roleId);
      if (response.status === 200) {
        setRole(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch role detail', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { role, loading, refetch: fetchDetail };
};

const RoleDetailHeader = ({
  role,
  router,
  onDelete,
}: {
  role: AciRole;
  router: any;
  onDelete: () => void;
}) => (
  <View className="bg-white p-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Detail Role</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-green-50"
          onPress={() =>
            router.push(`/pelayanan-publik/aci/admin/roles/edit/${role.id}`)
          }
        >
          <Ionicons name="pencil" size={20} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-red-50"
          onPress={onDelete}
        >
          <Ionicons name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>

    <View className="mt-6 items-center">
      <View className="size-20 items-center justify-center rounded-full bg-green-50">
        <Ionicons name="key" size={32} color="#10B981" />
      </View>
      <Text className="mt-3 text-xl font-bold text-[#0B2347]">{role.name}</Text>
    </View>
  </View>
);

const RoleDetailContent = ({ role }: { role: AciRole }) => (
  <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
    <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
      <Text className="mb-4 text-base font-bold text-[#0B2347]">
        Informasi Role
      </Text>

      <DetailItem label="Nama Role" value={role.name} icon="pricetag" />

      <DetailItem
        label="Tanggal Dibuat"
        value={new Date(role.created_at).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        icon="calendar-outline"
      />
      <DetailItem
        label="Terakhir Diupdate"
        value={new Date(role.updated_at).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        icon="time-outline"
      />
    </View>
    <View className="h-10" />
  </ScrollView>
);

const handleDeleteRole = (
  id: string | string[] | undefined,
  router: any,
  showAlert: any
) => {
  showAlert({
    type: 'confirm',
    title: 'Hapus Role',
    message:
      'Apakah Anda yakin ingin menghapus role ini? Tindakan ini tidak dapat dibatalkan.',
    onConfirm: async () => {
      try {
        const token = getItem<string>('aci_token');
        const roleId = Array.isArray(id) ? id[0] : id;
        if (!token || !roleId) return;

        await deleteAciRole(token, roleId);
        showAlert({
          type: 'success',
          title: 'Sukses',
          message: 'Role berhasil dihapus',
          onConfirm: () => router.back(),
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Gagal menghapus role';
        showAlert({ type: 'error', title: 'Error', message: msg });
      }
    },
  });
};

export default function RoleDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { role, loading, refetch } = useRoleDetailLogic(id);
  const { alertConfig, showAlert } = useAciAlert();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleDelete = () => handleDeleteRole(id, router, showAlert);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#10B981" size="large" />
      </View>
    );
  }

  if (!role) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Role tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <RoleDetailHeader role={role} router={router} onDelete={handleDelete} />
      <RoleDetailContent role={role} />
      <AciAlert {...alertConfig} />
    </View>
  );
}
