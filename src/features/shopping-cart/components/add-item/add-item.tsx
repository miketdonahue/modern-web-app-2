import React from 'react';
import { Button } from '@components/app';
import { CartProduct } from '@typings/api/product';
import { ShoppingCartContext } from '../../shopping-cart-context';

type AddItem = {
  item: CartProduct;
  onAdd?: () => void;
};

export const AddItem = ({ item, onAdd }: AddItem) => {
  const { addCartItem } = React.useContext(ShoppingCartContext);

  return (
    <Button
      onClick={() => {
        addCartItem(item);

        if (onAdd) onAdd();
      }}
    >
      Buy Now
    </Button>
  );
};
