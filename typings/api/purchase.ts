import { ApiResponseWithData, Data } from '@modules/api-response';
import { Purchase } from '@typings/entities/purchase';
import { Actor } from '@typings/entities/actor';

export type GetPurchaseResponse = ApiResponseWithData<
  Purchase,
  { actor: Actor }
>;

export type GetPurchaseData = Data<Purchase, { actor: Actor }>;
