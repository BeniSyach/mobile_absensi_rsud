import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  type AciLaporan,
  getAciKategoris,
  getAciLaporans,
} from '../../aci-service';

interface FetchLaporanListParams {
  token: string;
  pageNum: number;
  searchQuery: string;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setReports: React.Dispatch<React.SetStateAction<AciLaporan[]>>;
  setTotalPages: (pages: number) => void;
  setPage: (page: number) => void;
  uptId?: number | string;
}

const fetchLaporanList = async ({
  token,
  pageNum,
  searchQuery,
  setLoading,
  setRefreshing,
  setReports,
  setTotalPages,
  setPage,
  ...params
}: FetchLaporanListParams) => {
  try {
    setLoading(true);
    const response = await getAciLaporans(token, {
      page: pageNum,
      per_page: 10,
      search: searchQuery,
      upt_id: params.uptId,
    });

    if (response) {
      setReports((prev) =>
        pageNum === 1 ? response.data : [...prev, ...response.data]
      );
      setTotalPages(response.meta.total_pages);
      setPage(response.meta.page);
    }
  } catch (error) {
    console.error('Failed to fetch laporan', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

const fetchCategoryMap = async (token: string) => {
  try {
    const catRes = await getAciKategoris(token, { per_page: 100 });
    if (catRes.data && Array.isArray(catRes.data)) {
      const map: Record<number, string> = {};
      catRes.data.forEach((c: any) => {
        map[c.id] = c.nm_kategori || c.nama_kategori || c.nama || '';
      });
      return map;
    }
  } catch (e) {
    console.error('Failed to fetch categories list', e);
  }
  return null;
};

const getUserUptFilter = () => {
  const user = getItem<any>('aci_user');
  if (!user?.roles) return undefined;

  const roles = user.roles.map((r: any) => r.name.toLowerCase());
  // Check if user is UPT or SDA and strictly NOT superadmin/admin
  const isRestricted =
    (roles.includes('upt') || roles.includes('sda')) &&
    !roles.includes('superadmin') &&
    !roles.includes('admin');

  if (isRestricted && user.upt_id) {
    return user.upt_id;
  }
  return undefined;
};

export const useLaporanLogic = () => {
  const [reports, setReports] = useState<AciLaporan[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  const fetchReports = useCallback(
    async (pageNum: number, searchQuery: string = '') => {
      const token = getItem<string>('aci_token');
      if (!token) return;

      if (pageNum === 1) {
        const map = await fetchCategoryMap(token);
        if (map) setCategoryMap(map);
      }

      const uptIdFilter = getUserUptFilter();

      await fetchLaporanList({
        token,
        pageNum,
        searchQuery,
        setLoading,
        setRefreshing,
        setReports,
        setTotalPages,
        setPage,
        uptId: uptIdFilter,
      });
    },
    []
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setPage(1);
        fetchReports(1, text);
      }, 500)
    );
  };

  return {
    reports,
    loading,
    search,
    refreshing,
    page,
    handleSearch,
    handleLoadMore: () => {
      if (!loading && page < totalPages) fetchReports(page + 1, search);
    },
    onRefresh: () => {
      setRefreshing(true);
      setPage(1);
      fetchReports(1, search);
    },
    fetchReports,
    categoryMap,
  };
};

export default function Ignored() {
  return null;
}
