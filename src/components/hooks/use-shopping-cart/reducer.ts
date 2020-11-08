import { CartProduct } from '@typings/api/product';
import { ReducerAction } from '@typings/react';

export type ReducerState = {
  items: CartProduct[];
  total: number;
  status: string;
};

/**
 * Reducer action types
 */
export const types = {
  INIT_CART: 'INIT_CART',
  ADD_CART_ITEM: 'ADD_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
  INCREMENT_CART_ITEM: 'INCREMENT_CART_ITEM',
  DECREMENT_CART_ITEM: 'DECREMENT_CART_ITEM',
  DELETE_CART: 'DELETE_CART',
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
  action: ReducerAction<Partial<ReducerState>>
): ReducerState => {
  switch (action.type) {
    case types.INIT_CART:
      return { ...state, ...action.payload };
    case types.ADD_CART_ITEM:
      return { ...state, ...action.payload };
    case types.REMOVE_CART_ITEM:
      return { ...state, ...action.payload };
    case types.INCREMENT_CART_ITEM:
      return { ...state, ...action.payload };
    case types.DECREMENT_CART_ITEM:
      return { ...state, ...action.payload };
    case types.DELETE_CART:
      return { ...state, ...initialState };
    default:
      return state;
  }
};
