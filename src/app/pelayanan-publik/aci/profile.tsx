import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router'; // Correct import for router
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { AciBottomNavigation } from '@/components/pelayanan-publik-component/aci/bottom-navigation';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { getItem, setItem } from '@/lib/storage';

import {
  type AciUser,
  BASE_URL,
  getAciProfile,
  updateAciAvatar,
} from './aci-service';
import { useAciAlert } from './hooks/use-aci-alert';
import { compressImageIfNeeded } from './utils/image-utils';

const ProfileHeader = () => {
  const router = useRouter(); // Use useRouter hook
  return (
    <View className="px-6 pt-6">
      <View className="flex-row items-center justify-between rounded-[40px] bg-[#0066FF] px-6 py-4 shadow-lg shadow-blue-200">
        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-white shadow-sm"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/pelayanan-publik/aci/dashboard');
            }
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white">Profil Saya</Text>

        <TouchableOpacity
          className="size-10 items-center justify-center rounded-full bg-white shadow-sm"
          onPress={() => router.push('/pelayanan-publik/aci/edit-profile')}
        >
          <Ionicons name="create-outline" size={20} color="#0066FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProfileInfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) => (
  <View className="mb-3 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
    <View className="mr-4 items-center justify-center rounded-full bg-blue-50 p-2">
      <Ionicons name={icon} size={20} color="#0066FF" />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-500">{label}</Text>
      <Text className="font-semibold text-gray-800">{value || '-'}</Text>
    </View>
  </View>
);

const performAvatarUpdate = async (
  token: string,
  user: AciUser,
  {
    onUpdate,
    showAlert,
    setUploading,
    setLocalImage,
  }: {
    onUpdate: () => void;
    showAlert: (config: any) => void;
    setUploading: (val: boolean) => void;
    setLocalImage: (uri: string | null) => void;
  }
) => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert({
        type: 'error',
        title: 'Izin Ditolak',
        message: 'Butuh izin kamera untuk foto profil.',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const { uri, fileSize } = await compressImageIfNeeded(asset);
      setLocalImage(uri);
      setUploading(true);
      const formData = new FormData();
      // @ts-ignore
      formData.append('avatar', {
        uri,
        name: asset.fileName || 'avatar.jpg',
        type: asset.mimeType || 'image/jpeg',
        fileSize,
      });

      await updateAciAvatar(token, user.id, formData);
      showAlert({
        type: 'success',
        title: 'Sukses',
        message: 'Foto profil berhasil diperbarui',
      });
      onUpdate();
    }
  } catch (e) {
    console.error(e);
    showAlert({
      type: 'error',
      title: 'Error',
      message: 'Gagal mengupload foto profil',
    });
    setLocalImage(null);
  } finally {
    setUploading(false);
  }
};

const useAvatarUpload = ({
  token,
  user,
  onUpdate,
  showAlert,
}: {
  token: string | null;
  user: AciUser | null;
  onUpdate: () => void;
  showAlert: (config: any) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const handleUpdateAvatar = async () => {
    if (!user?.id || !token) return;
    await performAvatarUpdate(token, user, {
      onUpdate,
      showAlert,
      setUploading,
      setLocalImage,
    });
  };

  return { uploading, handleUpdateAvatar, localImage };
};

const AvatarSection = ({
  user,
  onUpdate,
  showAlert,
}: {
  user: AciUser | null;
  onUpdate: () => void;
  showAlert: (config: any) => void;
}) => {
  const token = getItem<string>('aci_token');
  const { uploading, handleUpdateAvatar, localImage } = useAvatarUpload({
    token,
    user,
    onUpdate,
    showAlert,
  });

  const avatarSource = localImage
    ? { uri: localImage }
    : user?.avatar_url
      ? { uri: user.avatar_url }
      : user?.id && user?.avatar && token
        ? {
            uri: `${BASE_URL}/api/acount/${user.id}/avatar?v=${user.avatar}`,
            headers: { Authorization: `Bearer ${token}` },
          }
        : {
            uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          };

  return (
    <View className="mt-6 items-center px-6">
      <View className="relative">
        <Image
          source={avatarSource}
          className="size-24 rounded-full border-4 border-white shadow-md"
          contentFit="cover"
        />
        <TouchableOpacity
          className="absolute bottom-0 right-0 rounded-full bg-[#0066FF] p-2 shadow-sm"
          onPress={handleUpdateAvatar}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="camera" size={16} color="white" />
          )}
        </TouchableOpacity>
      </View>
      <Text className="mt-3 text-xl font-bold text-[#0B2347]">
        {user?.name}
      </Text>
      <Text className="text-sm text-gray-500">{user?.email}</Text>
    </View>
  );
};

const PersonalInfoSection = ({ user }: { user: AciUser | null }) => (
  <View className="mt-8 px-6">
    <Text className="mb-4 text-lg font-bold text-[#0B2347]">
      Informasi Pribadi
    </Text>
    <ProfileInfoItem
      label="Nama Lengkap"
      value={user?.name || ''}
      icon="person-outline"
    />
    <ProfileInfoItem
      label="Email"
      value={user?.email || ''}
      icon="mail-outline"
    />
    <ProfileInfoItem
      label="Nomor HP / WhatsApp"
      value={user?.no_wa || ''}
      icon="logo-whatsapp"
    />
    <ProfileInfoItem label="NIK" value={user?.nik || '-'} icon="card-outline" />
  </View>
);

const MenuSection = () => {
  const router = useRouter();

  return (
    <View className="mt-4 px-6">
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm"
        onPress={() => router.push('/pelayanan-publik/aci/login-history')}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="time-outline" size={24} color="#0066FF" />
          <Text className="font-semibold text-gray-800">Riwayat Login</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm"
        onPress={() => router.push('/pelayanan-publik/aci/activity-log')}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="pulse-outline" size={24} color="#0066FF" />
          <Text className="font-semibold text-gray-800">Aktivitas Saya</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm"
        onPress={() => router.push('/pelayanan-publik/aci/security')}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="shield-checkmark-outline" size={24} color="#0066FF" />
          <Text className="font-semibold text-gray-800">Keamanan Akun</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
};

const performFetchProfile = async (
  showLoading: boolean,
  {
    setLoading,
    setUser,
    router,
  }: {
    setLoading: (val: boolean) => void;
    setUser: (user: AciUser | null) => void;
    router: { replace: (path: string) => void };
  }
) => {
  if (showLoading) setLoading(true);

  if (showLoading) {
    const storedUser = getItem<AciUser>('aci_user');
    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
    }
  }

  try {
    const token = getItem<string>('aci_token');

    if (!token) {
      if (showLoading) {
        Alert.alert('Error', 'Token tidak ditemukan. Silakan login kembali.');
        router.replace('/pelayanan-publik/aci');
      }
      return;
    }

    const data = await getAciProfile(token);
    console.log('Profile Response:', JSON.stringify(data, null, 2));

    const profileData = data?.user || data?.data || data;

    if (profileData && (profileData.id || profileData.email)) {
      setUser(profileData);
      setItem('aci_user', profileData);
    } else {
      console.warn('Unknown profile data structure:', data);
      if (!showLoading) {
        Alert.alert('Info', 'Format data profil tidak dikenali');
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch profile', error);

    const errorMessage =
      error?.response?.data?.message || 'Gagal memuat profil.';

    if (showLoading) {
      const hasStored = !!getItem<AciUser>('aci_user');
      if (!hasStored) {
        Alert.alert('Error', errorMessage);
      }
    } else {
      Alert.alert('Gagal', errorMessage);
    }
  } finally {
    if (showLoading) setLoading(false);
  }
};

const useProfileData = () => {
  const router = useRouter();
  const [user, setUser] = useState<AciUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    (showLoading = true) => {
      // @ts-ignore
      performFetchProfile(showLoading, { setLoading, setUser, router });
    },
    [router]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, loading, refetch: () => fetchProfile(false) };
};

export default function AciProfile() {
  const { user, loading, refetch } = useProfileData();
  const [refreshing, setRefreshing] = useState(false);
  const { alertConfig, showAlert, hideAlert } = useAciAlert();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  const showFooter = !user?.roles?.some(
    (r: any) => r.name.toUpperCase() !== 'MASYARAKAT' && r.name !== ''
  );

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
        <ProfileHeader />
        <AvatarSection user={user} onUpdate={refetch} showAlert={showAlert} />
        <PersonalInfoSection user={user} />
        <MenuSection />
      </ScrollView>

      {showFooter && <AciBottomNavigation />}
      <AciAlert {...alertConfig} onConfirm={hideAlert} />
    </View>
  );
}
