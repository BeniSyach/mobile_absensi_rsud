import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  type AciSkpd,
  type AciSkpdResponse,
  getAciSkpds,
} from '../../aci-service';

// Helper function to fetch SKPD data from API
interface FetchSkpdsParams {
  pageNum: number;
  searchQuery: string;
  setSkpds: React.Dispatch<React.SetStateAction<AciSkpd[]>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}

async function fetchSkpdsData(params: FetchSkpdsParams) {
  const {
    pageNum,
    searchQuery,
    setSkpds,
    setTotalPages,
    setPage,
    setLoading,
    setRefreshing,
  } = params;

  const token = getItem<string>('aci_token');
  if (!token) return;

  try {
    setLoading(true);
    const response: AciSkpdResponse = await getAciSkpds(token, {
      page: pageNum,
      per_page: 10,
      search: searchQuery,
    });

    if (response.status === 200) {
      setSkpds((prev) =>
        pageNum === 1 ? response.data : [...prev, ...response.data]
      );
      setTotalPages(response.meta.total_pages);
      setPage(response.meta.page);
    }
  } catch (error) {
    console.error('Failed to fetch SKPD list', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}

export const useSkpdLogic = () => {
  const [skpds, setSkpds] = useState<AciSkpd[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchSkpds = useCallback(
    async (pageNum: number, searchQuery: string = '') => {
      await fetchSkpdsData({
        pageNum,
        searchQuery,
        setSkpds,
        setTotalPages,
        setPage,
        setLoading,
        setRefreshing,
      });
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      fetchSkpds(1, '');
    }, [fetchSkpds])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        setPage(1);
        fetchSkpds(1, text);
      }, 500)
    );
  };

  const handleLoadMore = () =>
    !loading && page < totalPages && fetchSkpds(page + 1, search);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchSkpds(1, search);
  };

  return {
    skpds,
    loading,
    search,
    refreshing,
    page,
    handleSearch,
    handleLoadMore,
    onRefresh,
    fetchSkpds,
  };
};

export default function Ignored() {
  return null;
}
