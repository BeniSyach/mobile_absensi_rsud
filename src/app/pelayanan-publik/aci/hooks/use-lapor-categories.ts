import { useCallback, useEffect, useState } from 'react';

import { getItem } from '@/lib/storage';

import { type AciKategori, getAciKategoris } from '../aci-service';

export const useLaporCategories = () => {
  const [categories, setCategories] = useState<AciKategori[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const token = getItem<string>('aci_token');
      if (!token) return;

      const response = await getAciKategoris(token, { per_page: 100 });
      setCategories(response.data || []);
    } catch (error) {
      console.error('Fetch categories failed', error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loadingCategories };
};

export default function Ignored() {
  return null;
}
