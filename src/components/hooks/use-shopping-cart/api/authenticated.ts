import { request } from '@modules/request';
import { CartProduct } from '@typings/entities/product';
import { CartMethodResponse } from '@typings/entities/cart';
import { ReducerAction } from '@typings/react';
import { getCartTotal } from '../utils';
import { types, ReducerState } from '../reducer';

const serverAddItem = async (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const myCart = await request.get('/api/v1/carts/me');
  const response = await request.post(
    `/api/v1/carts/${myCart.data.data.attributes.id}/add-item`,
    {
      cart_id: myCart.data.data.attributes.id,
      product_id: item.attributes.id,
    }
  );

  const transformedItems = response.data.data.map(
    (result: CartMethodResponse) => {
      return {
        attributes: {
          ...result.relationships?.product,
          quantity: result.attributes.quantity,
        },
      };
    }
  );

  dispatch({
    type: types.ADD_CART_ITEM,
    payload: {
      items: transformedItems,
      total: getCartTotal(transformedItems),
    },
  });
};

const serverIncrementItem = async (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const myCart = await request.get('/api/v1/carts/me');
  const response = await request.post(
    `/api/v1/carts/${myCart.data.data.attributes.id}/increment-item`,
    {
      cart_id: myCart.data.data.attributes.id,
      product_id: item.attributes.id,
    }
  );

  const transformedItems = response.data.data.map(
    (result: CartMethodResponse) => {
      return {
        attributes: {
          ...result.relationships?.product,
          quantity: result.attributes.quantity,
        },
      };
    }
  );

  dispatch({
    type: types.INCREMENT_CART_ITEM,
    payload: {
      items: transformedItems,
      total: getCartTotal(transformedItems),
    },
  });
};

const serverDecrementItem = async (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const myCart = await request.get('/api/v1/carts/me');
  const response = await request.post(
    `/api/v1/carts/${myCart.data.data.attributes.id}/decrement-item`,
    {
      cart_id: myCart.data.data.attributes.id,
      product_id: item.attributes.id,
    }
  );

  const transformedItems = response.data.data.map(
    (result: CartMethodResponse) => {
      return {
        attributes: {
          ...result.relationships?.product,
          quantity: result.attributes.quantity,
        },
      };
    }
  );

  dispatch({
    type: types.DECREMENT_CART_ITEM,
    payload: {
      items: transformedItems,
      total: getCartTotal(transformedItems),
    },
  });
};

const serverRemoveItem = async (
  item: CartProduct,
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const myCart = await request.get('/api/v1/carts/me');
  const response = await request.post(
    `/api/v1/carts/${myCart.data.data.attributes.id}/remove-item`,
    {
      cart_id: myCart.data.data.attributes.id,
      product_id: item.attributes.id,
    }
  );

  const transformedItems = response.data.data.map(
    (result: CartMethodResponse) => {
      return {
        attributes: {
          ...result.relationships?.product,
          quantity: result.attributes.quantity,
        },
      };
    }
  );

  dispatch({
    type: types.REMOVE_CART_ITEM,
    payload: {
      items: transformedItems,
      total: getCartTotal(transformedItems),
      status: 'new',
    },
  });
};

const serverDeleteCart = async (
  dispatch: React.Dispatch<ReducerAction<Partial<ReducerState>>>
) => {
  const myCart = await request.get('/api/v1/carts/me');
  await request.delete(`/api/v1/carts/${myCart.data.data.attributes.id}`);

  dispatch({
    type: types.DELETE_CART,
  });
};

export {
  serverAddItem,
  serverRemoveItem,
  serverIncrementItem,
  serverDecrementItem,
  serverDeleteCart,
};
