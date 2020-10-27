import React from 'react';
import { Button } from '@components/app';
import { CartProduct } from '@typings/entities/product';
import { ShoppingCartContext } from '../../shopping-cart-context';

type AddItem = {
  item: CartProduct;
};

export const AddItem = ({ item }: AddItem) => {
  const { addCartItem } = React.useContext(ShoppingCartContext);

  return <Button onClick={() => addCartItem(item)}>Buy Now</Button>;
};
