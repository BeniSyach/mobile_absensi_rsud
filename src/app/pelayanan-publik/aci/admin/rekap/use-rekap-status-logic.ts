import { useCallback, useEffect, useState } from 'react';

import { getItem } from '@/lib/storage';

import { getAciRekapStatus } from '../../aci-service';

const STATUS_LABELS: Record<string, string> = {
  pengajuan: 'Pengajuan',
  diterima: 'Diterima',
  diverifikasi: 'Diverifikasi',
  dalam_penanganan: 'Dalam Penanganan',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

const STATUS_MAP: Record<string, number> = {
  pengajuan: 0,
  diterima: 1,
  diverifikasi: 2,
  dalam_penanganan: 3,
  selesai: 4,
  ditolak: 5,
};

const processRekapResponse = (res: any) => {
  // Use res directly as it matches the API response structure
  // { rekap_status: {...}, data: [...] }
  const payload = res;

  let rekap: any[] = [];

  if (payload.rekap_status) {
    const statusEntries = !Array.isArray(payload.rekap_status)
      ? payload.rekap_status
      : payload.rekap_status.reduce((acc: any, curr: any) => {
          const key = Object.keys(STATUS_MAP).find(
            (k) => STATUS_MAP[k] === curr.status_laporan
          );
          if (key) acc[key] = curr.total;
          return acc;
        }, {});

    rekap = Object.entries(STATUS_MAP).map(([key, id]) => ({
      status_laporan: id,
      label: STATUS_LABELS[key],
      total: statusEntries[key] || 0,
    }));
  }

  const laporan = Array.isArray(payload.data) ? payload.data : [];

  return { rekap, laporan };
};

const fetchRekapDataFromApi = async (
  token: string,
  selectedStatus: number | null
) => {
  const statsPromise = getAciRekapStatus(token);

  const listParams: any = {};
  if (selectedStatus !== null) listParams.status_laporan = selectedStatus;

  const listPromise = getAciRekapStatus(token, listParams);

  const [statsRes, listRes] = await Promise.all([statsPromise, listPromise]);

  return {
    rekapStatus: processRekapResponse(statsRes).rekap,
    laporanStatus: processRekapResponse(listRes).laporan,
  };
};

const filterLaporanBySearch = (laporan: any[], search: string) => {
  if (!search.trim()) return laporan;
  const s = search.toLowerCase();
  return laporan.filter((item: any) => {
    const rootTitle = (item.judul || '').toLowerCase();
    const rootDesc = (item.deskripsi || '').toLowerCase();
    const rootAddr = (item.alamat || item.lokasi || '').toLowerCase();
    const rootName = (item.nama || item.name || '').toLowerCase();
    const rootNik = (item.nik || '').toLowerCase();
    const user = item.user || {};
    const userName = (
      user.name ||
      user.nama ||
      user.nm_pengguna ||
      ''
    ).toLowerCase();
    const userNik = (user.nik || '').toLowerCase();
    return (
      rootTitle.includes(s) ||
      rootDesc.includes(s) ||
      rootAddr.includes(s) ||
      rootName.includes(s) ||
      rootNik.includes(s) ||
      userName.includes(s) ||
      userNik.includes(s)
    );
  });
};

const useRekapFilters = () => {
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const resetFilters = useCallback(() => {
    setSelectedStatus(null);
    setSearch('');
  }, []);
  return { selectedStatus, setSelectedStatus, search, setSearch, resetFilters };
};

const useRekapData = (filters: ReturnType<typeof useRekapFilters>) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    rekapStatus: [] as any[],
    laporanStatus: [] as any[],
  });
  const { selectedStatus, search } = filters;

  const fetchRekap = useCallback(async () => {
    try {
      setLoading(true);
      const token = getItem<string>('aci_token');
      if (!token) return;
      const result = await fetchRekapDataFromApi(token, selectedStatus);
      setData(result);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchRekap();
  }, [fetchRekap]);

  return {
    loading,
    data: {
      ...data,
      laporanStatus: filterLaporanBySearch(data.laporanStatus, search),
    },
    refresh: fetchRekap,
  };
};

const useReportPagination = (filteredReports: any[]) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const totalPages = Math.ceil(filteredReports.length / PER_PAGE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [filteredReports.length, totalPages, page]);

  const paginatedReports = filteredReports.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  const resetPage = useCallback(() => setPage(1), []);

  return { paginatedReports, page, totalPages, setPage, resetPage };
};

export const useRekapLogic = () => {
  const filters = useRekapFilters();
  const { loading, data, refresh } = useRekapData(filters);
  const { paginatedReports, page, totalPages, setPage, resetPage } =
    useReportPagination(data.laporanStatus);

  useEffect(() => {
    resetPage();
  }, [filters.search, filters.selectedStatus, resetPage]);

  return {
    loading,
    refresh,
    rekapStatus: data.rekapStatus,
    laporanStatus: paginatedReports,
    page,
    totalPages,
    onPageChange: setPage,
    totalReports: data.laporanStatus.length,
    ...filters,
  };
};

export default function Ignored() {
  return null;
}
