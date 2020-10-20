import React from 'react';
import { Button } from '@components/app';
import { GetProduct } from '@typings/stripe';
import { ShoppingCartContext } from '../../shopping-cart-context';

type AddItem = {
  item: GetProduct;
};

export const AddItem = ({ item }: AddItem) => {
  const { addCartItem } = React.useContext(ShoppingCartContext);

  return <Button onClick={() => addCartItem(item)}>Buy Now</Button>;
};
