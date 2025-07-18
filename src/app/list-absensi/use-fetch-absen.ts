import { useCallback, useEffect, useState } from 'react';

import { useGetAllAbsenMasukByUser } from '@/api/absensi/masuk/get-absen-masuk-by-user';
import { getMessage } from '@/lib/message-storage';

export default function UseFetchAbsen() {
  const storedMessage = getMessage();
  const userId = storedMessage?.nik ?? '';

  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: fetchedData,
    isPending,
    error,
    refetch,
  } = useGetAllAbsenMasukByUser({
    variables: { userId, page },
    enabled: !!userId,
  });

  // Reset data ketika page kembali ke 1
  useEffect(() => {
    if (page === 1) {
      setData([]);
    }
  }, [page, userId]);

  // Update data berdasarkan hasil fetch
  useEffect(() => {
    if (fetchedData?.data) {
      setData((prevData) =>
        page === 1 ? fetchedData.data : [...prevData, ...fetchedData.data]
      );
      setHasMoreData(fetchedData.data.length > 0);
    }
  }, [fetchedData, page]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1); // ini akan trigger useEffect untuk reset data
    try {
      await refetch(); // fetch ulang halaman 1
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!isPending && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isPending, hasMoreData]);

  return {
    data,
    isPending,
    error,
    handleLoadMore,
    isRefreshing,
    onRefresh,
  };
}
