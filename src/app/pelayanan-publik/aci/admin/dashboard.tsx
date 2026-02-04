import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import { BASE_URL } from '../aci-service';
import { useAdminDashboardLogic } from './use-admin-dashboard-logic';

// ... (imports)

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    className="size-10 items-center justify-center rounded-full bg-white shadow-sm"
    onPress={onPress}
  >
    <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const RefreshButton = ({
  refreshing,
  onPress,
}: {
  refreshing: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} disabled={refreshing}>
    {refreshing ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <Ionicons name="refresh" size={24} color="white" />
    )}
  </TouchableOpacity>
);

const HeaderTitle = ({ user }: { user: any }) => (
  <View className="flex-1 items-center px-2">
    <Text
      className="text-center text-lg font-bold text-white"
      numberOfLines={1}
    >
      Ahoiii, {user?.name || 'Admin'}
    </Text>
    <Text className="text-[10px] text-white/90">Cek laporan kamu hari ini</Text>
  </View>
);

const getAvatarSource = (user: any) => {
  return user?.avatar_url
    ? { uri: user.avatar_url }
    : user?.id && user?.avatar
      ? { uri: `${BASE_URL}/api/acount/${user.id}/avatar?v=${user.avatar}` }
      : {
          uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        };
};

const AdminMenuCard = ({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-2 w-[48.5%] rounded-2xl bg-white p-3 shadow-sm shadow-gray-100"
    activeOpacity={0.7}
  >
    <View className="flex-row items-center">
      <View
        className="size-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold leading-tight text-[#0B2347]">
          {title}
        </Text>
        <Text className="mt-0.5 text-[10px] font-medium leading-tight text-gray-400">
          {subtitle}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const AdminDropdownMenu = ({
  user,
  visible,
  onLogout,
  onProfile,
}: {
  user: any;
  visible: boolean;
  onLogout: () => void;
  onProfile: () => void;
}) => {
  if (!visible) return null;

  return (
    <View className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
      <View className="mb-3 border-b border-gray-100 pb-3">
        <Text className="text-sm font-bold text-[#0B2347]">
          {user?.name || 'Admin'}
        </Text>
        <Text className="mt-0.5 text-xs text-gray-500">
          {user?.roles?.[0]?.name || 'Administrator'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onProfile}
        className="mb-1 flex-row items-center rounded-lg p-2 active:bg-gray-50"
      >
        <View className="mr-2 rounded-full bg-blue-50 p-1.5">
          <Ionicons name="person-outline" size={16} color="#0066FF" />
        </View>
        <Text className="font-medium text-gray-700">Profil Saya</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLogout}
        className="flex-row items-center rounded-lg p-2 active:bg-gray-50"
      >
        <View className="mr-2 rounded-full bg-red-50 p-1.5">
          <Ionicons name="log-out-outline" size={16} color="#EF4444" />
        </View>
        <Text className="font-medium text-red-500">Keluar</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminDashboardHeader = ({
  user,
  onLogout,
  router,
  refreshing,
  onRefresh,
}: {
  user: any;
  onLogout: () => void;
  router: any;
  refreshing: boolean;
  onRefresh: () => void;
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const avatarSource = getAvatarSource(user);

  const handleProfileClick = () => {
    setDropdownVisible(false);
    router.push('/pelayanan-publik/aci/profile');
  };

  const handleLogoutClick = () => {
    setDropdownVisible(false);
    onLogout();
  };

  return (
    <View className="relative z-50 px-6 pt-6">
      <View className="relative flex-row items-center justify-between rounded-[40px] bg-[#0066FF] px-6 py-4 shadow-lg shadow-blue-200">
        <HeaderBackButton onPress={() => router.back()} />

        <HeaderTitle user={user} />

        <View className="flex-row items-center gap-3">
          <RefreshButton refreshing={refreshing} onPress={onRefresh} />

          <View className="relative">
            <TouchableOpacity
              onPress={() => setDropdownVisible(!dropdownVisible)}
              className="rounded-full border-2 border-white"
            >
              <Image
                source={avatarSource}
                className="size-10 rounded-full"
                contentFit="cover"
              />
            </TouchableOpacity>

            <AdminDropdownMenu
              user={user}
              visible={dropdownVisible}
              onLogout={handleLogoutClick}
              onProfile={handleProfileClick}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const RekapCard = ({
  title,
  count,
  icon,
  color,
}: {
  title: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) => (
  <View className="mb-2 w-[31.5%] rounded-2xl border border-gray-100 bg-white p-2 shadow-sm shadow-gray-100">
    <View className="flex-row items-center">
      <View
        className="size-7 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <View className="ml-1.5 flex-1">
        <Text className="text-[8px] font-bold uppercase leading-[9px] tracking-wider text-gray-400">
          {title}
        </Text>
        <Text className="text-sm font-black text-[#0B2347]">
          {(count ?? 0).toLocaleString()}
        </Text>
      </View>
    </View>
  </View>
);

const RekapSection = ({ stats }: { stats: any }) => {
  if (!stats?.rekap_status) return null;

  return (
    <View className="mb-8">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-[#0B2347]">Rekap Laporan</Text>
        <View className="rounded-full bg-blue-50 px-3 py-1">
          <Text className="text-[10px] font-bold uppercase text-blue-600">
            Per Status
          </Text>
        </View>
      </View>
      <View className="flex-row flex-wrap justify-between">
        <RekapCard
          title="Pengajuan"
          count={stats.rekap_status.pengajuan}
          icon="file-tray"
          color="#F59E0B"
        />
        <RekapCard
          title="Diterima"
          count={stats.rekap_status.diterima}
          icon="checkmark-circle"
          color="#3B82F6"
        />
        <RekapCard
          title="Diverifikasi"
          count={stats.rekap_status.diverifikasi}
          icon="shield-checkmark"
          color="#6366F1"
        />
        <RekapCard
          title="Proses"
          count={stats.rekap_status.dalam_penanganan}
          icon="construct"
          color="#8B5CF6"
        />
        <RekapCard
          title="Selesai"
          count={stats.rekap_status.selesai}
          icon="ribbon"
          color="#10B981"
        />
        <RekapCard
          title="Ditolak"
          count={stats.rekap_status.ditolak}
          icon="close-circle"
          color="#EF4444"
        />
      </View>
    </View>
  );
};

const AdminMenuGrid = ({
  router,
  isSuperAdmin,
  canSeeRekap,
}: {
  router: any;
  isSuperAdmin: boolean;
  canSeeRekap: boolean;
}) => (
  <View className="mb-4">
    <Text className="mb-4 text-lg font-bold text-[#0B2347]">
      Menu Manajemen
    </Text>
    <View className="flex-row flex-wrap justify-between pb-10">
      <AdminMenuCard
        title="Laporan Masyarakat"
        subtitle="Kelola Laporan"
        icon="file-tray-full"
        color="#0EA5E9"
        onPress={() => router.push('/pelayanan-publik/aci/admin/laporan')}
      />

      {canSeeRekap && (
        <AdminMenuCard
          title="Rekap"
          subtitle="Statistik & Grafik"
          icon="stats-chart"
          color="#059669"
          onPress={() => router.push('/pelayanan-publik/aci/admin/rekap')}
        />
      )}

      {isSuperAdmin && (
        <>
          <AdminMenuCard
            title="Masyarakat"
            subtitle="Register User"
            icon="people-circle"
            color="#EC4899"
            onPress={() =>
              router.push('/pelayanan-publik/aci/admin/masyarakat')
            }
          />
          <AdminMenuCard
            title="User"
            subtitle="Kelola Pengguna"
            icon="people"
            color="#8B5CF6"
            onPress={() => router.push('/pelayanan-publik/aci/admin/users')}
          />
          <SecondaryMenuGrid router={router} isSuperAdmin={isSuperAdmin} />
        </>
      )}
    </View>
  </View>
);

const SecondaryMenuGrid = ({
  router,
  isSuperAdmin,
}: {
  router: any;
  isSuperAdmin: boolean;
}) => {
  if (!isSuperAdmin) return null;

  return (
    <>
      <AdminMenuCard
        title="UPT"
        subtitle="Manajemen Unit"
        icon="business"
        color="#6366F1"
        onPress={() => router.push('/pelayanan-publik/aci/admin/upt')}
      />
      <AdminMenuCard
        title="SKPD"
        subtitle="Data SKPD"
        icon="business"
        color="#F97316"
        onPress={() => router.push('/pelayanan-publik/aci/admin/skpd')}
      />
      <AdminMenuCard
        title="Kategori"
        subtitle="Kelola Kategori"
        icon="list"
        color="#DC2626"
        onPress={() => router.push('/pelayanan-publik/aci/admin/kategori')}
      />
      <AdminMenuCard
        title="Role"
        subtitle="Atur Hak Akses"
        icon="key"
        color="#10B981"
        onPress={() => router.push('/pelayanan-publik/aci/admin/roles')}
      />
    </>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { loading, stats, user, refetch, handleLogout, alertConfig } =
    useAdminDashboardLogic();

  const userRoles = user?.roles?.map((r: any) => r.name.toUpperCase()) || [];
  const isSuperAdmin = userRoles.includes('SUPERADMIN');
  const canSeeRekap =
    isSuperAdmin || userRoles.includes('SDA') || userRoles.includes('UPT');

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <AdminDashboardHeader
        user={user}
        onLogout={handleLogout}
        router={router}
        refreshing={loading}
        onRefresh={refetch}
      />
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <RekapSection stats={stats} />
        <AdminMenuGrid
          router={router}
          isSuperAdmin={isSuperAdmin}
          canSeeRekap={canSeeRekap}
        />
      </ScrollView>

      <AciAlert {...alertConfig} />
    </View>
  );
}
