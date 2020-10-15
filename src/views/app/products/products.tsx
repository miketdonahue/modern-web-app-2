import React from 'react';
import { useGetProducts } from '@modules/queries/products';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { Button } from '@components/app';
import { ShoppingCart } from '@features/shopping-cart';
// import styles from './products.module.scss';

const Products = () => {
  const { addCartItem } = useShoppingCart();
  const { data: response, isLoading } = useGetProducts();
  const products = response?.data;

  return (
    <div style={{ height: 2000 }}>
      <div className="my-4 mx-8">
        <div className="flex justify-end mb-4">
          <ShoppingCart />
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
    </div>
  );
};

export { Products };
