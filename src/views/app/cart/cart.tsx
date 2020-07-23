import React from 'react';
// import Link from 'next/link';
import { Product as ProductModel } from '@server/entities/product';
// import { useRouter } from 'next/router';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { Button } from '@components/app';
import { Data } from '@modules/api-response/typings';
// import styles from './cart.module.scss';

type Product = Data & {
  attributes: ProductModel;
};

const Cart = () => {
  const { cart, cartTotal, removeCartItem } = useShoppingCart();

  return (
    <div>
      <ul>
        {cart?.map((item: Product) => {
          return (
            <li key={item.id} className="flex space-x-8">
              <div>
                <img
                  src={item.attributes.thumbnail}
                  alt={item.attributes.name}
                  width="75"
                />
              </div>
              <div>{item.attributes.name}</div>
              <button type="button" onClick={() => removeCartItem(item)}>
                Remove
              </button>
              <div>
                {item.attributes.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        Subtotal:{' '}
        {cartTotal.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </div>

      <Button className="mt-4">Checkout</Button>
    </div>
  );
};

export { Cart };
