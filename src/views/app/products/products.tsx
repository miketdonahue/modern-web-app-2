import React from 'react';
import Link from 'next/link';
import { useGetProducts } from '@modules/queries/products';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { ShoppingCart, Dropdown, Button } from '@components/app';
// import styles from './products.module.scss';

const Products = () => {
  const { items, total, addCartItem } = useShoppingCart();
  const { data: response, isLoading } = useGetProducts();
  const products = response?.data;

  return (
    <div className="my-4 mx-8">
      <div className="flex justify-end mb-4">
        <Dropdown>
          <Dropdown.Toggle id="shopping-cart">
            <ShoppingCart count={items.length} />
          </Dropdown.Toggle>

          <Dropdown.Menu
            role="list"
            className="p-2 shadow-md bg-white space-y-2 rounded-sm"
          >
            <ul>
              {items?.map((item) => {
                return (
                  <li key={item.attributes.id}>
                    <div className="flex justify-between space-x-4">
                      <div className="whitespace-no-wrap">
                        {item.attributes.name}
                      </div>
                      <div>
                        {(
                          (item.relationships?.price.unit_amount || 0) / 100
                        ).toLocaleString('en-US', {
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
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {!isLoading &&
          products?.map((result) => {
            const productPrice =
              (result.relationships?.price.unit_amount || 0) / 100;

            return (
              <div key={result.attributes.id}>
                <img
                  src={`/images/products/${result.attributes.id}.jpg`}
                  alt={result.attributes.name}
                  width="100%"
                />
                <div>{result.attributes.name}</div>
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
