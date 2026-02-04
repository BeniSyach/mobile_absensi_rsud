import React, { useEffect, useState } from 'react';

import {
  getAciMasyarakatDetail,
  getAciUserDetail,
} from '@/app/pelayanan-publik/aci/aci-service';
import { Text } from '@/components/ui/text';
import { getItem } from '@/lib/storage';

// In-memory cache to avoid duplicate requests for the same user in one session
const userCache: Record<string, string> = {};

interface AciReporterNameProps {
  userId?: string | number;
  item?: any;
  className?: string;
}

const getProvidedName = (item: any) => {
  if (!item) return null;
  return (
    item.user?.name ||
    item.user?.nama ||
    item.user?.nm_pengguna ||
    item.nama_pelapor ||
    item.user_name ||
    item.nama ||
    (item.name !== item.judul ? item.name : null)
  );
};

const fetchMissingName = async (sId: string) => {
  try {
    const token = getItem<string>('aci_token');
    if (!token) return null;

    // Try /api/users
    try {
      const res = await getAciUserDetail(token, sId);
      const data = res?.data as any;
      if (data?.name || data?.nama) return (data.name || data.nama) as string;
    } catch (e) {}

    // Try /api/pengguna (Masyarakat)
    try {
      const res = await getAciMasyarakatDetail(token, sId);
      const data = res?.data as any;
      if (data?.name || data?.nama) return (data.name || data.nama) as string;
    } catch (e) {}
  } catch (err) {
    console.log('Error fetching reporter name for id:', sId, err);
  }
  return null;
};

export const AciReporterName = ({
  userId,
  item,
  className,
}: AciReporterNameProps) => {
  const [name, setName] = useState<string>('Anonim');

  useEffect(() => {
    const provided = getProvidedName(item);
    if (provided) {
      setName(provided);
      return;
    }

    if (!userId) {
      setName('Anonim');
      return;
    }

    const sId = String(userId);
    if (userCache[sId]) {
      setName(userCache[sId]);
      return;
    }

    fetchMissingName(sId).then((foundName) => {
      if (foundName) {
        userCache[sId] = foundName;
        setName(foundName);
      }
    });
  }, [userId, item]);

  return (
    <Text className={className} numberOfLines={1}>
      {name}
    </Text>
  );
};
