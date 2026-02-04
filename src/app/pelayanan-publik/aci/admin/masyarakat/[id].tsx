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
  Alert,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { getItem } from '@/lib/storage';

import {
  type AciUser,
  deleteAciMasyarakat,
  getAciMasyarakatDetail,
  getAvatarSource,
} from '../../aci-service';
import { useAciAlert } from '../../hooks/use-aci-alert';

const DetailItem = ({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) => {
  const Content = (
    <View className="mb-4 flex-row items-center border-b border-gray-100 pb-4">
      <View className="mr-4 size-10 items-center justify-center rounded-full bg-blue-50">
        <Ionicons name={icon} size={20} color="#0066FF" />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-gray-400">{label}</Text>
        <Text
          className={`text-sm font-semibold ${
            onPress ? 'text-[#0066FF] underline' : 'text-[#0B2347]'
          }`}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{Content}</TouchableOpacity>;
  }
  return Content;
};

const useMasyarakatDetailLogic = (id?: string | string[]) => {
  const [user, setUser] = useState<AciUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const storedToken = getItem<string>('aci_token');
      const userId = Array.isArray(id) ? id[0] : id;
      if (!storedToken || !userId) return;

      const response = await getAciMasyarakatDetail(storedToken, userId);
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch masyarakat detail', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { user, loading, refetch: fetchDetail };
};

const MasyarakatDetailHeader = ({
  user,
  router,
  onDelete,
  token,
}: {
  user: AciUser;
  router: any;
  onDelete: () => void;
  token?: string;
}) => {
  const hasAvatar = !!(user.avatar || user.avatar_url);

  return (
    <View className="bg-white p-6 shadow-sm shadow-gray-100">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#0B2347]">
          Detail Masyarakat
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full bg-blue-50"
            onPress={() =>
              router.push(
                `/pelayanan-publik/aci/admin/masyarakat/edit/${user.id}`
              )
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
        {hasAvatar ? (
          <Image
            source={getAvatarSource(user, token)}
            className="size-24 rounded-full border-4 border-gray-50"
            contentFit="cover"
          />
        ) : (
          <View className="size-24 items-center justify-center rounded-full border-4 border-gray-50 bg-pink-50">
            <Ionicons name="person" size={40} color="#EC4899" />
          </View>
        )}
        <Text className="mt-3 text-xl font-bold text-[#0B2347]">
          {user.name}
        </Text>
        <Text className="text-sm text-gray-500">{user.email}</Text>
      </View>
    </View>
  );
};

const openWhatsApp = (no_wa: string) => {
  let phoneNumber = no_wa.replace(/\D/g, ''); // Remove non-numeric chars
  if (phoneNumber.startsWith('0')) {
    phoneNumber = '62' + phoneNumber.slice(1);
  }

  // Explicitly using whatsapp:// protocol
  const url = `whatsapp://send?phone=${phoneNumber}`;

  // Check if supported first ideally, but openURL catch is fine too
  Linking.openURL(url).catch(() => {
    // Fallback to web if app not installed
    Linking.openURL(`https://wa.me/${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'WhatsApp tidak dapat dibuka');
    });
  });
};

const MasyarakatDetailContent = ({ user }: { user: AciUser }) => {
  const handleWhatsAppPress = useCallback(() => {
    if (user.no_wa) openWhatsApp(user.no_wa);
  }, [user.no_wa]);

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
          onPress={user.no_wa ? handleWhatsAppPress : undefined}
        />
        <DetailItem label="NIK" value={user.nik || '-'} icon="card-outline" />

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

const handleDeleteMasyarakat = (
  id: string | string[] | undefined,
  router: any,
  showAlert: any
) => {
  showAlert({
    type: 'confirm',
    title: 'Hapus Masyarakat',
    message:
      'Apakah Anda yakin ingin menghapus user masyarakat ini? Tindakan ini tidak dapat dibatalkan.',
    onConfirm: async () => {
      try {
        const token = getItem<string>('aci_token');
        const userId = Array.isArray(id) ? id[0] : id;
        if (!token || !userId) return;

        await deleteAciMasyarakat(token, userId);
        showAlert({
          type: 'success',
          title: 'Sukses',
          message: 'Masyarakat berhasil dihapus',
          onConfirm: () => router.back(),
        });
      } catch (error: any) {
        const msg =
          error?.response?.data?.message || 'Gagal menghapus masyarakat';
        showAlert({
          type: 'error',
          title: 'Error',
          message: msg,
        });
      }
    },
  });
};

export default function MasyarakatDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading, refetch } = useMasyarakatDetailLogic(id);
  const token = getItem<string>('aci_token');
  const { alertConfig, showAlert } = useAciAlert();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleDelete = () => handleDeleteMasyarakat(id, router, showAlert);

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
        <Text>Masyarakat tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <MasyarakatDetailHeader
        user={user}
        router={router}
        onDelete={handleDelete}
        token={token}
      />
      <MasyarakatDetailContent user={user} />
      <AciAlert {...alertConfig} />
    </View>
  );
}
