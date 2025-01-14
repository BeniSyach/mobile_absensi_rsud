import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { PostSPTResponse, PostSPTVariables } from './types';

export const PutSPT = createMutation<
  PostSPTResponse,
  PostSPTVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `/api/spt/${variables.id}`,
      method: 'PUT',
      data: variables,
    }).then((response) => response.data),
});
