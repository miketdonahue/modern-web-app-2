import { GetProduct } from '@typings/entities/product';
import { ReducerAction } from '@typings/react';

export type ReducerState = {
  items: GetProduct[];
  total: number;
  status: string;
};

type ReducerPayload = {
  item: GetProduct;
};

/**
 * Reducer action types
 */
export const types = {
  ADD_CART_ITEM: 'ADD_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
  INCREMENT_CART_ITEM: 'INCREMENT_CART_ITEM',
  DECREMENT_CART_ITEM: 'DECREMENT_CART_ITEM',
  SYNC_CART: 'SYNC_CART',
};

/**
 * Initial reducer state
 */
export const initialState: ReducerState = {
  items: [],
  total: 0,
  status: 'new',
};

/**
 * Reducer
 */
export const reducer = (
  state: ReducerState,
  action: ReducerAction<ReducerPayload>
): ReducerState => {
  switch (action.type) {
    case types.ADD_CART_ITEM:
      return { ...state, ...action.payload };
    case types.REMOVE_CART_ITEM:
      return { ...state, ...action.payload };
    case types.INCREMENT_CART_ITEM:
      return { ...state, ...action.payload };
    case types.DECREMENT_CART_ITEM:
      return { ...state, ...action.payload };
    case types.SYNC_CART:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
