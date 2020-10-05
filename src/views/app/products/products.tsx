import React from 'react';
import Link from 'next/link';
import { getPrices } from '@modules/queries/prices';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { Button, ShoppingCart, Dropdown } from '@components/app';
// import styles from './products.module.scss';

const Products = () => {
  const { items, total, addCartItem } = useShoppingCart();
  const { data: response, isLoading } = getPrices();
  const prices = response?.data;

  return (
    <div className="my-4 mx-8">
      <div className="flex justify-end mb-4">
        <Dropdown
          triggerElement={<ShoppingCart count={5} />}
          placement="bottom-right"
          offset={30}
          className="p-2 shadow-md bg-white space-y-2 rounded-sm"
        >
          <ul>
            {items?.map((item) => {
              return (
                <li key={item.id}>
                  <div className="flex justify-between space-x-4">
                    <div className="whitespace-no-wrap">
                      {item.product.name}
                    </div>
                    <div>
                      {((item.unit_amount || 0) / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </div>
                  </div>
                </li>
              );
            })}

            <li className="text-right">
              Total:{' '}
              {total.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </li>
          </ul>

          <Link href="/app/cart" as="/app/cart">
            <Button>Go to Cart</Button>
          </Link>
        </Dropdown>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {!isLoading &&
          prices?.map((result) => {
            const productPrice = (result.unit_amount || 0) / 100;

            return (
              <div key={result.id}>
                <img
                  src={`/images/products/${result.product.id}.jpg`}
                  alt={result.product.name}
                  width="100%"
                />
                <div>{result.product.name}</div>
                <div>
                  {productPrice.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <Button onClick={() => addCartItem(result)}>Buy Now</Button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export { Products };
