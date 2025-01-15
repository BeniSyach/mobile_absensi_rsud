import { useCallback, useEffect, useState } from 'react';

import { useGetAllAbsenMasukByUser } from '@/api/absensi/masuk/get-absen-masuk-by-user';
import { getMessage } from '@/lib/message-storage';

export default function UseFetchAbsen() {
  const storedMessage = getMessage();
  const userId = storedMessage?.id;

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

  useEffect(() => {
    console.log('Fetched data:', fetchedData);
    if (fetchedData) {
      setData((prevData) =>
        page === 1 ? fetchedData : [...prevData, ...fetchedData]
      );
      setHasMoreData(fetchedData.length > 0);
    }
  }, [fetchedData, page]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    try {
      await refetch();
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

  // console.log('Fetching data for page:', page);
  console.log('Data length:', data.length);
  // console.log('Has more data:', hasMoreData);
  // console.log('Is pending:', isPending);

  return {
    data,
    isPending,
    error,
    handleLoadMore,
    isRefreshing,
    onRefresh,
  };
}
