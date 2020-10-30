import { request } from '@modules/request';

const getActorCartItems = async (actorId: string) => {
  const response = await request.get(`/api/v1/actors/${actorId}/cart-items`);
  return response.data;
};

export { getActorCartItems };
