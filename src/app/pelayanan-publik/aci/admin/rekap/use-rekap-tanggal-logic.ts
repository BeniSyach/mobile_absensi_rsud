import { useCallback, useEffect, useState } from 'react';

import { getItem } from '@/lib/storage';

import { getAciRekapTanggal } from '../../aci-service';

const filterReports = (
  laporan: any[],
  search: string,
  dateFilter: string | null
) => {
  let filtered = laporan;

  if (dateFilter) {
    filtered = filtered.filter((item: any) => {
      const reportDate = item.created_at?.split('T')[0];
      return reportDate === dateFilter;
    });
  }

  if (!search.trim()) return filtered;

  const s = search.toLowerCase();
  return filtered.filter((item: any) => {
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

const fetchRekapData = async (token: string, params: any) => {
  try {
    const res = await getAciRekapTanggal(token, params);
    if (res.status) {
      return { rekap: res.rekap_tanggal || [], laporan: res.data || [] };
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

const getParams = (
  startDate: Date,
  endDate: Date,
  selectedStatus: number | null
) => ({
  tanggal_awal: startDate.toISOString().split('T')[0],
  tanggal_akhir: endDate.toISOString().split('T')[0],
  status_laporan: selectedStatus ?? undefined,
});

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

export const useRekapTanggalLogic = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    rekap: [] as any[],
    laporan: [] as any[],
  });
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(
    null
  );

  const fetchRekap = useCallback(async () => {
    setLoading(true);
    const token = getItem<string>('aci_token');
    if (token) {
      const params = getParams(startDate, endDate, selectedStatus);
      const result = await fetchRekapData(token, params);
      if (result) setData(result);
    }
    setLoading(false);
  }, [startDate, endDate, selectedStatus]);

  const filteredReports = filterReports(
    data.laporan,
    search,
    selectedDateFilter
  );
  const { paginatedReports, page, totalPages, setPage, resetPage } =
    useReportPagination(filteredReports);

  useEffect(() => {
    fetchRekap();
    setSelectedDateFilter(null);
    resetPage();
  }, [fetchRekap, resetPage]);

  useEffect(() => {
    resetPage();
  }, [search, selectedDateFilter, resetPage]);

  return {
    loading,
    refresh: fetchRekap,
    rekap: data.rekap,
    laporan: paginatedReports,
    page,
    totalPages,
    onPageChange: setPage,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    selectedStatus,
    setSelectedStatus,
    search,
    setSearch,
    selectedDateFilter,
    setSelectedDateFilter,
    totalReports: filteredReports.length,
  };
};
