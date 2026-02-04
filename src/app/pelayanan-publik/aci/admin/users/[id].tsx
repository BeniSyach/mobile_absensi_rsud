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
  type AciUser,
  deleteAciUser,
  getAciUptDetail,
  getAciUserDetail,
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
    <View className="mr-4 size-10 items-center justify-center rounded-full bg-blue-50">
      <Ionicons name={icon} size={20} color="#0066FF" />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-400">{label}</Text>
      <Text className="text-sm font-semibold text-[#0B2347]">{value}</Text>
    </View>
  </View>
);

const useUserDetailLogic = (id?: string | string[]) => {
  const [user, setUser] = useState<AciUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const storedToken = getItem<string>('aci_token');
      const userId = Array.isArray(id) ? id[0] : id;
      if (!storedToken || !userId) return;

      const response = await getAciUserDetail(storedToken, userId);
      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);

        // If UPT relation is missing but upt_id exists, fetch UPT name
        if (!userData.upt?.nama_upt && userData.upt_id) {
          try {
            const uptRes = await getAciUptDetail(
              storedToken,
              userData.upt_id.toString()
            );
            if (uptRes.status === 200) {
              setUser((prev) =>
                prev ? { ...prev, upt: uptRes.data } : userData
              );
            }
          } catch (e) {
            console.warn('Failed to fetch UPT detail', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user detail', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { user, loading, refetch: fetchDetail };
};

const UserDetailHeader = ({
  user,
  router,
  onDelete,
}: {
  user: AciUser;
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
      <Text className="text-lg font-bold text-[#0B2347]">Detail User</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-blue-50"
          onPress={() =>
            router.push(`/pelayanan-publik/aci/admin/users/edit/${user.id}`)
          }
        >
          <Ionicons name="pencil" size={20} color="#0066FF" />
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
      <View className="mb-3 size-16 items-center justify-center rounded-full bg-blue-50">
        <Ionicons name="person" size={32} color="#0066FF" />
      </View>
      <Text className="text-xl font-bold text-[#0B2347]">{user.name}</Text>
      <Text className="text-sm text-gray-500">{user.email}</Text>
    </View>
  </View>
);

const UserDetailContent = ({ user }: { user: AciUser }) => {
  const isUptRole = user.roles?.some((r) =>
    r.name.toLowerCase().includes('upt')
  );

  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200">
        <Text className="mb-4 text-base font-bold text-[#0B2347]">
          Informasi Pribadi
        </Text>

        <DetailItem
          label="Nomor WhatsApp"
          value={user.no_wa || '-'}
          icon="logo-whatsapp"
        />
        <DetailItem label="NIK" value={user.nik || '-'} icon="card-outline" />

        {isUptRole && (
          <DetailItem
            label="UPT"
            value={user.upt?.nama_upt || user.upt_id || '-'}
            icon="business-outline"
          />
        )}

        <Text className="mb-4 mt-2 text-base font-bold text-[#0B2347]">
          Aktivitas Akun
        </Text>
        <DetailItem
          label="Terakhir Login"
          value={
            user.last_login_at
              ? new Date(user.last_login_at).toLocaleString('id-ID')
              : '-'
          }
          icon="time-outline"
        />
        <DetailItem
          label="IP Terakhir Login"
          value={user.last_login_ip || '-'}
          icon="globe-outline"
        />
        <DetailItem
          label="Tanggal Dibuat"
          value={new Date(user.created_at).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          icon="calendar-outline"
        />
      </View>
      <View className="h-10" />
    </ScrollView>
  );
};

const handleDeleteUser = (
  id: string | string[] | undefined,
  router: any,
  showAlert: any
) => {
  showAlert({
    type: 'confirm',
    title: 'Hapus User',
    message:
      'Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.',
    onConfirm: async () => {
      try {
        const token = getItem<string>('aci_token');
        const userId = Array.isArray(id) ? id[0] : id;
        if (!token || !userId) return;

        await deleteAciUser(token, userId);
        showAlert({
          type: 'success',
          title: 'Sukses',
          message: 'User berhasil dihapus',
          onConfirm: () => router.back(),
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Gagal menghapus user';
        showAlert({ type: 'error', title: 'Error', message: msg });
      }
    },
  });
};

export default function UserDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading, refetch } = useUserDetailLogic(id);
  const { alertConfig, showAlert } = useAciAlert();

  // Refresh when coming back from edit
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleDelete = () => handleDeleteUser(id, router, showAlert);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#0066FF" size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>User tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <UserDetailHeader user={user} router={router} onDelete={handleDelete} />
      <UserDetailContent user={user} />
      <AciAlert {...alertConfig} />
    </View>
  );
}
