import { useCallback, useEffect, useState } from 'react';

import { getItem } from '@/lib/storage';

import { getAciKecamatans, getAciRekapKecamatan } from '../../aci-service';

const mapKecamatan = (res: any) => {
  const allItems = Array.isArray(res) ? res : res.data || [];
  return allItems;
};

const fetchRekapData = async (
  token: string,
  id: string,
  status: number | null
) => {
  const params: any = { kecamatan_id: id };
  if (status !== null) params.status_laporan = status;
  const res = await getAciRekapKecamatan(token, params);
  return res.status
    ? {
        rekap_status: res.rekap_status,
        total: res.total,
        laporan: res.data || [],
      }
    : null;
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

const useKecamatanList = () => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    const token = getItem<string>('aci_token');
    if (token)
      getAciKecamatans(token, { per_page: 1000, wilayah_kabupaten_id: 1212 })
        .then((res) => setList(mapKecamatan(res)))
        .catch((e) => console.error(e));
  }, []);
  return list;
};

export const useRekapKecamatanLogic = () => {
  const [loading, setLoading] = useState(false);
  const kecamatanList = useKecamatanList();
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<string | null>(
    null
  );
  const [data, setData] = useState<any>({
    rekap_status: null,
    total: 0,
    laporan: [],
  });
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const fetchRekap = useCallback(async () => {
    const token = getItem<string>('aci_token');
    if (!selectedKecamatanId || !token) return;
    try {
      setLoading(true);
      const res = await fetchRekapData(
        token,
        selectedKecamatanId,
        selectedStatus
      );
      if (res) setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedKecamatanId, selectedStatus]);

  useEffect(() => {
    if (selectedKecamatanId) fetchRekap();
    else setData({ rekap_status: null, total: 0, laporan: [] });
  }, [fetchRekap, selectedKecamatanId]);

  const filteredReports = filterLaporanBySearch(data.laporan, search);
  const { paginatedReports, page, totalPages, setPage, resetPage } =
    useReportPagination(filteredReports);

  useEffect(() => {
    resetPage();
  }, [search, selectedStatus, selectedKecamatanId, resetPage]);

  return {
    loading,
    kecamatanList,
    selectedKecamatanId,
    setSelectedKecamatanId,
    selectedStatus,
    setSelectedStatus,
    search,
    setSearch,
    rekapStatus: data.rekap_status,
    total: filteredReports.length,
    laporan: paginatedReports,
    refresh: fetchRekap,
    page,
    totalPages,
    onPageChange: setPage,
  };
};
