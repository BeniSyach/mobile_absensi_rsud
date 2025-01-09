import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { PostSPTResponse, PostSPTVariables } from './types';

export const PostSPT = createMutation<
  PostSPTResponse,
  PostSPTVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/spt',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
