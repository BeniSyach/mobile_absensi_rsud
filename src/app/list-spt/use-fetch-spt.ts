import { useCallback, useEffect, useState } from 'react';

import { useGetAllSPTByUser } from '@/api';
import { getMessage } from '@/lib';

export default function UseFetchSPT() {
  const storedMessage = getMessage();
  const userId = storedMessage?.data.nik;

  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: fetchedData,
    isPending,
    error,
    refetch,
  } = useGetAllSPTByUser({
    variables: { userId, page },
    enabled: !!userId,
  });

  // Reset data saat userId atau page == 1
  useEffect(() => {
    if (page === 1) {
      setData([]); // reset data dulu sebelum fetch baru
    }
  }, [page, userId]);

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
    setPage(1); // Ini akan trigger reset data di useEffect atas
    try {
      await refetch(); // refetch manual
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
