import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { getItem } from '@/lib/storage';

import {
  type AciLaporan,
  getAciKategoris,
  getAciLaporans,
} from './aci-service';

// Helper to build category map from API response
const buildCategoryMap = (categories: any[]) => {
  const catMap: Record<number, string> = {};
  if (Array.isArray(categories)) {
    categories.forEach((cat) => {
      catMap[cat.id] = cat.nm_kategori || cat.nama_kategori || '';
    });
  }
  return catMap;
};

export const useRiwayatLogic = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<AciLaporan[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  const fetchReports = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) setRefreshing(true);
        else setLoading(true);

        const token = getItem<string>('aci_token');
        if (!token) return;

        const [reportsRes, categoriesRes] = await Promise.all([
          getAciLaporans(token, { per_page: 50, search: search }),
          getAciKategoris(token, { per_page: 100 }),
        ]);

        setReports(reportsRes.data || []);
        setCategoryMap(buildCategoryMap(categoriesRes.data));
      } catch (error) {
        console.error('Fetch reports/categories failed', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search]
  );

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => fetchReports(), 500);
      return () => clearTimeout(timer);
    }, [fetchReports])
  );

  return {
    router,
    loading,
    reports,
    refreshing,
    onRefresh: () => fetchReports(true),
    search,
    setSearch,
    categoryMap,
  };
};

export default function Ignored() {
  return null;
}
