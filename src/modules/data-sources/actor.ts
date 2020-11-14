import { AxiosResponse } from 'axios';
import { request } from '@modules/request';
import { GetProduct } from '@typings/api/product';

const getActorCourses = async (): Promise<AxiosResponse<GetProduct[]>> => {
  const response = await request.get('/api/v1/actor/courses');
  return response.data;
};

export { getActorCourses };
