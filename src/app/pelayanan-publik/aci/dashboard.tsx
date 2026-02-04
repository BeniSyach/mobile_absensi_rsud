import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { AciBottomNavigation } from '@/components/pelayanan-publik-component/aci/bottom-navigation';
import { DashboardChart } from '@/components/pelayanan-publik-component/aci/dashboard-chart';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import {
  type AciDashboardResponse,
  type AciUser,
  BASE_URL,
} from './aci-service';
import { useDashboardLogic } from './use-dashboard-logic';

const DropdownMenu = ({
  user,
  visible,
  onLogout,
  onAdminMenu,
}: {
  user: AciUser | null;
  visible: boolean;
  onLogout: () => void;
  onAdminMenu: () => void;
}) => {
  if (!visible) return null;
  const userRoles = user?.roles?.map((r) => r.name.toLowerCase()) || [];
  const isAdmin = userRoles.some(
    (role) => role !== 'masyarakat' && role !== ''
  );

  return (
    <View className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
      <View className="mb-3 border-b border-gray-100 pb-3">
        <Text className="text-sm font-bold text-[#0B2347]">
          {user?.name || '-'}
        </Text>
        <Text className="mt-0.5 text-xs text-gray-500">
          {user?.roles?.[0]?.name || 'User'}
        </Text>
      </View>

      {isAdmin && (
        <TouchableOpacity
          onPress={onAdminMenu}
          className="mb-1 flex-row items-center rounded-lg p-2 active:bg-gray-50"
        >
          <View className="mr-2 rounded-full bg-blue-50 p-1.5">
            <Ionicons name="grid-outline" size={16} color="#0066FF" />
          </View>
          <Text className="font-medium text-gray-700">Menu Admin</Text>
        </TouchableOpacity>
      )}

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

const getAvatarSource = (user: AciUser | null) => {
  return user?.avatar_url
    ? { uri: user.avatar_url }
    : user?.id && user?.avatar
      ? { uri: `${BASE_URL}/api/acount/${user.id}/avatar?v=${user.avatar}` }
      : {
          uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        };
};

const AciDashboardHeader = ({
  user,
  onLogout,
  router,
}: {
  user: AciUser | null;
  onLogout: () => void;
  router: any;
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogoutClick = () => {
    setDropdownVisible(false);
    onLogout();
  };

  const handleAdminMenuClick = () => {
    setDropdownVisible(false);
    router.push('/pelayanan-publik/aci/admin/dashboard');
  };

  const avatarSource = getAvatarSource(user);

  return (
    <View className="relative z-50 px-6 pt-6">
      <View className="relative flex-row items-center justify-between rounded-[40px] bg-[#0066FF] px-6 py-4 shadow-lg shadow-blue-200">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-white shadow-sm"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View className="flex-1 items-center px-2">
          <Text
            className="text-center text-lg font-bold text-white"
            numberOfLines={1}
          >
            Ahoiii, {user?.name || 'Pengguna'}
          </Text>
          <Text className="text-[10px] text-white/90">
            Cek laporan kamu hari ini
          </Text>
        </View>

        <View className="relative">
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            className="flex-row items-center gap-2"
          >
            <View className="rounded-full border-2 border-white">
              <Image
                source={avatarSource}
                className="size-12 rounded-full"
                contentFit="cover"
              />
            </View>
          </TouchableOpacity>
          <DropdownMenu
            user={user}
            visible={dropdownVisible}
            onLogout={handleLogoutClick}
            onAdminMenu={handleAdminMenuClick}
          />
        </View>
      </View>
    </View>
  );
};

const StatusBadge = ({ status }: { status: string | number }) => {
  const getStatusConfig = (s: string | number = '0') => {
    const safeStatus = (s === null || s === undefined ? '0' : s)
      .toString()
      .toLowerCase();

    if (safeStatus === '0' || safeStatus === 'pending') {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        label: 'Pengajuan',
      };
    }
    if (safeStatus === '1') {
      return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Diterima' };
    }
    if (safeStatus === '2') {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        label: 'Diverifikasi',
      };
    }
    if (safeStatus === '3' || safeStatus === 'diproses') {
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        label: 'Ditangani',
      };
    }
    if (safeStatus === '4' || safeStatus === 'selesai') {
      return { bg: 'bg-green-50', text: 'text-green-600', label: 'Selesai' };
    }
    if (safeStatus === '5' || safeStatus === 'ditolak') {
      return { bg: 'bg-red-50', text: 'text-red-600', label: 'Ditolak' };
    }

    return {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      label: 'N/A',
    };
  };

  const config = getStatusConfig(status);

  return (
    <View className={`rounded-full px-2 py-0.5 ${config.bg}`}>
      <Text className={`text-[8px] font-bold ${config.text}`}>
        {config.label.toUpperCase()}
      </Text>
    </View>
  );
};

const AciBanner = () => (
  <View className="mt-6 h-40 w-full overflow-hidden rounded-3xl">
    <Image
      source={require('../../../../assets/image/pelayanan-publik/aci/dashboard.png')}
      className="size-full"
      contentFit="cover"
    />
  </View>
);

const AciDashboardHero = () => {
  return (
    <View className="px-6 pt-6">
      <Text className="text-[28px] font-extrabold leading-tight text-[#0066FF]">
        Laporkan Masalah
      </Text>
      <Text className="text-[28px] font-extrabold leading-tight text-[#0066FF]">
        Infrastruktur
      </Text>
      <Text className="mt-1 text-base text-gray-400">
        Laporkan.Tindak.Selesai
      </Text>

      <View className="mt-6 flex-row gap-3">
        <View className="flex-1 flex-row items-center rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <Ionicons name="search-outline" size={24} color="#9CA3AF" />
          <TextInput
            placeholder="Cari laporan atau lokasi"
            className="ml-3 flex-1 font-inter text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity className="size-14 items-center justify-center rounded-2xl bg-[#0066FF] shadow-sm">
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <AciBanner />
    </View>
  );
};

const StatCard = ({
  title,
  count,
  imageSource,
  iconName,
}: {
  title: string;
  count: string;
  imageSource?: any;
  iconName?: any;
}) => (
  <View className="mb-4 w-[48%] rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
    <View className="flex-row items-start gap-3">
      {imageSource ? (
        <Image source={imageSource} className="size-10" contentFit="contain" />
      ) : (
        <View className="size-10 items-center justify-center rounded-xl bg-blue-50">
          <Ionicons name={iconName} size={24} color="#0066FF" />
        </View>
      )}
      <View className="flex-1">
        <Text className="mb-1 text-[11px] font-bold leading-3 text-[#0B2347]">
          {title}
        </Text>
        <Text className="text-2xl font-extrabold text-[#0B2347]">{count}</Text>
      </View>
    </View>
  </View>
);

const StatisticsSection = ({
  stats,
}: {
  stats: AciDashboardResponse | null;
}) => {
  return (
    <View className="mt-8 px-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-black">
            Laporan Masyarakat
          </Text>
          <Text className="text-xs text-gray-500">
            Total laporan masyarakat: {stats?.total ?? 0}
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
          <Text className="mr-1 text-xs font-semibold text-[#0066FF]">
            Tahun {new Date().getFullYear()}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066FF" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <StatCard
          title="Jumlah Pengajuan"
          count={(stats?.rekap_status?.pengajuan ?? 0).toString()}
          imageSource={require('../../../../assets/image/pelayanan-publik/aci/jmlh-pengajuan.png')}
        />
        <StatCard
          title="Laporan Diterima"
          count={(stats?.rekap_status?.diterima ?? 0).toString()}
          iconName="checkmark-circle-outline"
        />
        <StatCard
          title="Laporan Diverifikasi"
          count={(stats?.rekap_status?.diverifikasi ?? 0).toString()}
          iconName="shield-checkmark-outline"
        />
        <StatCard
          title="Dalam Penanganan"
          count={(stats?.rekap_status?.dalam_penanganan ?? 0).toString()}
          imageSource={require('../../../../assets/image/pelayanan-publik/aci/penanganan.png')}
        />
        <StatCard
          title="Penanganan Selesai"
          count={(stats?.rekap_status?.selesai ?? 0).toString()}
          imageSource={require('../../../../assets/image/pelayanan-publik/aci/selesai.png')}
        />
        <StatCard
          title="Laporan Ditolak"
          count={(stats?.rekap_status?.ditolak ?? 0).toString()}
          imageSource={require('../../../../assets/image/pelayanan-publik/aci/ditolak.png')}
        />
      </View>
    </View>
  );
};

const LatestReportsSection = ({
  reports,
  router,
}: {
  reports: any[];
  router: any;
}) => {
  if (!reports || reports.length === 0) return null;

  return (
    <View className="mt-8 px-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-black">Laporan Terbaru</Text>
          <Text className="text-xs text-gray-500">Cek update laporan Anda</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/pelayanan-publik/aci/riwayat')}
        >
          <Text className="text-xs font-semibold text-[#0066FF]">
            Lihat Semua
          </Text>
        </TouchableOpacity>
      </View>

      {reports.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          activeOpacity={0.7}
          onPress={() =>
            router.push(`/pelayanan-publik/aci/riwayat/${item.id}`)
          }
        >
          <View className="mr-3 size-12 items-center justify-center rounded-xl bg-blue-50">
            <Ionicons name="document-text-outline" size={24} color="#0066FF" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-[#0B2347]" numberOfLines={1}>
              {item.deskripsi}
            </Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="location-outline" size={12} color="#9CA3AF" />
              <Text
                className="ml-1 text-[10px] text-gray-400"
                numberOfLines={1}
              >
                {item.alamat || 'Lokasi tidak tersedia'}
              </Text>
            </View>
          </View>
          <View className="items-end pl-2">
            <StatusBadge status={item.status_laporan} />
            <Text className="mt-1 text-[9px] text-gray-400">
              {new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const DashboardLoading = () => (
  <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
    <ActivityIndicator size="large" color="#0066FF" />
  </View>
);

export default function AciDashboard() {
  const {
    user,
    stats,
    refreshing,
    onRefresh,
    handleLogout,
    router,
    filterDays,
    setFilterDays,
    alertConfig,
  } = useDashboardLogic();

  const isAdmin = user?.roles?.some(
    (r) => r.name.toUpperCase() !== 'MASYARAKAT' && r.name !== ''
  );

  if (isAdmin) return <DashboardLoading />;

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AciDashboardHeader
          user={user}
          onLogout={handleLogout}
          router={router}
        />
        <AciDashboardHero />
        <StatisticsSection stats={stats} />
        <LatestReportsSection
          reports={stats?.data_terbaru || []}
          router={router}
        />
        <DashboardChart
          data={stats?.rekap_tanggal}
          days={filterDays}
          onDaysChange={setFilterDays}
        />
      </ScrollView>

      {!isAdmin && <AciBottomNavigation />}
      <AciAlert {...alertConfig} />
    </View>
  );
}
