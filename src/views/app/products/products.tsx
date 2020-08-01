import React from 'react';
import Link from 'next/link';
import { getProducts } from '@modules/queries/products';
import { Product as ProductModel } from '@server/entities/product';
// import { useRouter } from 'next/router';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { Button, ShoppingCart, Dropdown } from '@components/app';
import { Data } from '@modules/api-response/typings';
// import styles from './products.module.scss';

type Product = Data<ProductModel>;

const Products = () => {
  const { items, total, addCartItem } = useShoppingCart();
  const { data: response, isLoading } = getProducts();
  const products = response?.data;

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
            {items?.map((item: Product) => {
              return (
                <li key={item.id}>
                  <div className="flex justify-between space-x-4">
                    <div className="whitespace-no-wrap">
                      {item.attributes?.name}
                    </div>
                    <div>
                      {item.attributes?.price.toLocaleString('en-US', {
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
          products.map((product: Product) => {
            return (
              <div key={product.id}>
                <img
                  src={product.attributes?.image}
                  alt={product.attributes?.name}
                  width="100%"
                />
                <div>{product.attributes?.name}</div>
                <div>
                  {product.attributes?.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <Button onClick={() => addCartItem(product)}>Buy Now</Button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export { Products };
