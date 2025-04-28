import { useGetAllSPTByUser } from "@/api";
import { getMessage } from "@/lib";
import { useState, useEffect, useCallback } from "react";

export default function UseFetchSPT() {
  const storedMessage = getMessage();
  const userId = storedMessage?.data.nik;

  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data : fetchedData, isPending, error, refetch } = useGetAllSPTByUser({
    variables: { userId, page },
    enabled: !!userId,
  });

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

  return {
    data,
    isPending,
    error,
    handleLoadMore,
    isRefreshing,
    onRefresh,
  };
}
