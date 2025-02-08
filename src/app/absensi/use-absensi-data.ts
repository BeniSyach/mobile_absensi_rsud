import { useFocusEffect } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';

import { GetUser, useGetLocationDetail } from '@/api';
import { getMessage } from '@/lib/message-storage';

export default function useAbsensiData() {
  const storedMessage = getMessage();
  const [pageLoading, setPageLoading] = useState(true);

  const {
    data: location,
    isLoading: locationLoading,
    isError,
    refetch: ceklokasi,
  } = useGetLocationDetail({
    variables: { id: storedMessage?.opd_id ?? 2 },
    enabled: !!storedMessage?.opd_id,
  });

  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = GetUser({
    variables: storedMessage?.id,
    enabled: !!storedMessage?.id,
  });

  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setPageLoading(true);
        if (storedMessage?.id) {
          await Promise.all([refetchUser(), ceklokasi()]);
        }
        setPageLoading(false);
      };
      loadData();
    }, [storedMessage?.id, refetchUser, ceklokasi])
  );

  return {
    location,
    user,
    isError,
    isLoading: pageLoading || locationLoading || userLoading,
  };
}
