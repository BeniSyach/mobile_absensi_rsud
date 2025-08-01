import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

type ViewSPTParams = {
  userId?: number;
  file?: string;
};

export const useViewSPT = createQuery<ArrayBuffer, ViewSPTParams, AxiosError>({
  queryKey: ['useViewSPT'],
  fetcher: async ({ userId, file }) => {
    if (!userId) throw new Error('User ID is required');
    if (!file) throw new Error('File name is required');

    const url = `/absensi/files/spt/${file}/view`;

    const response = await client.get(url, {
      responseType: 'arraybuffer', // ⬅️ penting agar hasil dalam bentuk ArrayBuffer
    });

    return response.data;
  },
});
