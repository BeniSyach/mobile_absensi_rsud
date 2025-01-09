import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { UploadPhotoResponse, UploadPhotoVariables } from './types';

export const UploadPhoto = createMutation<
  UploadPhotoResponse,
  UploadPhotoVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/users/upload-photo', // URL API untuk upload foto
      method: 'POST',
      data: variables, // Variabel yang berisi foto dan data terkait
      headers: {
        'Content-Type': 'multipart/form-data', // Menyatakan bahwa kita mengirimkan form-data
      },
    }).then((response) => response.data),
});
