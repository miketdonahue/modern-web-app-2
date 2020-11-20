import { AxiosResponse } from 'axios';
import { Data } from '@modules/api-response';
import { request } from '@modules/request';

export const getGithubCode = async (
  filename: string
): Promise<AxiosResponse<Data<{ code: string }>>> => {
  const response = await request.get('/api/v1/github/code', {
    params: { filename },
  });

  return response.data;
};
