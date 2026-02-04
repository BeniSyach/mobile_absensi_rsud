import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { getItem } from '@/lib/storage';

import {
  type AciUser,
  type AciUsersResponse,
  getAciUsers,
} from '../aci-service';

const UserItem = ({
  user,
  onPress,
}: {
  user: AciUser;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-3 flex-row items-center rounded-2xl bg-white p-4 shadow-sm shadow-gray-200 active:bg-gray-50"
  >
    <View className="mr-4 size-12 items-center justify-center rounded-full bg-blue-50">
      <Ionicons name="person" size={20} color="#0066FF" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-bold text-[#0B2347]">{user.name}</Text>
      <Text className="text-xs text-gray-500">{user.email}</Text>
      <Text className="text-xs text-gray-400">{user.no_wa || '-'}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

interface FetchUsersListParams {
  token: string;
  pageNum: number;
  searchQuery: string;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<AciUser[]>>;
  setTotalPages: (pages: number) => void;
  setPage: (page: number) => void;
}

const fetchUsersList = async ({
  token,
  pageNum,
  searchQuery,
  setLoading,
  setRefreshing,
  setUsers,
  setTotalPages,
  setPage,
}: FetchUsersListParams) => {
  try {
    setLoading(true);
    const response: AciUsersResponse = await getAciUsers(token, {
      page: pageNum,
      per_page: 10,
      search: searchQuery,
    });

    if (response.status === 200) {
      setUsers((prev) =>
        pageNum === 1 ? response.data : [...prev, ...response.data]
      );
      setTotalPages(response.meta.total_pages);
      setPage(response.meta.page);
    }
  } catch (error) {
    console.error('Failed to fetch users', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

const useUsersLogic = () => {
  const [users, setUsers] = useState<AciUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchUsers = useCallback(
    async (pageNum: number, searchQuery: string = '') => {
      const token = getItem<string>('aci_token');
      if (!token) return;

      await fetchUsersList({
        token,
        pageNum,
        searchQuery,
        setLoading,
        setRefreshing,
        setUsers,
        setTotalPages,
        setPage,
      });
    },
    []
  );

  useEffect(() => {
    fetchUsers(1, '');
  }, [fetchUsers]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        setPage(1); // Reset to page 1 for new search
        fetchUsers(1, text);
      }, 500)
    );
  };

  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      fetchUsers(page + 1, search);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchUsers(1, search);
  };

  return {
    users,
    loading,
    search,
    refreshing,
    page,
    handleSearch,
    handleLoadMore,
    onRefresh,
    fetchUsers,
  };
};

const UsersListHeader = ({
  search,
  handleSearch,
  router,
}: {
  search: string;
  handleSearch: (text: string) => void;
  router: any;
}) => (
  <View className="bg-white px-6 pb-4 pt-6 shadow-sm shadow-gray-100">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50"
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={20} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-[#0B2347]">Manajemen User</Text>
      <TouchableOpacity
        className="size-10 items-center justify-center rounded-full bg-[#0066FF] shadow-sm shadow-blue-200"
        onPress={() => router.push('/pelayanan-publik/aci/admin/users/create')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>

    {/* Search Bar */}
    <View className="mt-4 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <Ionicons name="search" size={20} color="#9CA3AF" />
      <TextInput
        placeholder="Cari user..."
        className="ml-2 flex-1 text-base text-[#0B2347]"
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={handleSearch}
      />
    </View>
  </View>
);

export default function UsersList() {
  const router = useRouter();
  const {
    users,
    loading,
    search,
    refreshing,
    page,
    handleSearch,
    handleLoadMore,
    onRefresh,
    fetchUsers,
  } = useUsersLogic();

  useFocusEffect(
    useCallback(() => {
      fetchUsers(1, search);
    }, [fetchUsers, search])
  );

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen options={{ headerShown: false }} />
      <UsersListHeader
        search={search}
        handleSearch={handleSearch}
        router={router}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onPress={() =>
              router.push(`/pelayanan-publik/aci/admin/users/${item.id}`)
            }
          />
        )}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="mt-20 items-center">
              <Text className="text-gray-400">Tidak ada user ditemukan</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <View className="py-4">
              <ActivityIndicator color="#0066FF" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
