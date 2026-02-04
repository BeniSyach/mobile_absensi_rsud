import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import { type AciKategori, getAciKategoris } from '../../aci-service';

const performFetchKategoris = async ({
  pageNum,
  searchQuery,
  setLoading,
  setKategoris,
  setTotalPages,
  setPage,
  setRefreshing,
}: {
  pageNum: number;
  searchQuery: string;
  setLoading: (l: boolean) => void;
  setKategoris: React.Dispatch<React.SetStateAction<AciKategori[]>>;
  setTotalPages: (p: number) => void;
  setPage: (p: number) => void;
  setRefreshing: (r: boolean) => void;
}) => {
  const token = getItem<string>('aci_token');
  if (!token) return;
  try {
    setLoading(true);
    const res = await getAciKategoris(token, {
      page: pageNum,
      per_page: 10,
      search: searchQuery,
    });
    console.log('Kategori List Response:', JSON.stringify(res, null, 2));
    if (res.status === 200) {
      setKategoris((prev) =>
        pageNum === 1 ? res.data : [...prev, ...res.data]
      );
      setTotalPages(res.meta.total_pages);
      setPage(res.meta.page);
    }
  } catch (e) {
    console.error('Failed to fetch Kategori list', e);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

export const useKategoriLogic = () => {
  const [kategoris, setKategoris] = useState<AciKategori[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchKategoris = useCallback(
    (pageNum: number, searchQuery: string = '') => {
      performFetchKategoris({
        pageNum,
        searchQuery,
        setLoading,
        setKategoris,
        setTotalPages,
        setPage,
        setRefreshing,
      });
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      fetchKategoris(1, '');
    }, [fetchKategoris])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setPage(1);
        fetchKategoris(1, text);
      }, 500)
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchKategoris(1, search);
  };

  return {
    kategoris,
    loading,
    search,
    refreshing,
    page,
    handleSearch,
    handleLoadMore: () =>
      !loading && page < totalPages && fetchKategoris(page + 1, search),
    onRefresh,
    fetchKategoris,
  };
};

export default function Ignored() {
  return null;
}
