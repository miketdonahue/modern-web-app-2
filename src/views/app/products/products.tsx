import React from 'react';
import { useGetProducts } from '@modules/queries/products';
// import { useActor } from '@components/hooks/use-actor';
// import { useGetActorCart } from '@modules/queries/actor';
// import { Button } from '@components/app';
import { ShoppingCart } from '@features/shopping-cart';
// import styles from './products.module.scss';

const Products = () => {
  // const [actorId] = useActor();
  const { data: response, isLoading } = useGetProducts();
  // const { data: cartItems } = useGetActorCart(actorId, {
  //   enabled: !!actorId,
  // });

  const products = response?.data;
  // const actorCartItems = cartItems?.data;

  return (
    <ShoppingCart>
      <div className="my-4 mx-8">
        <div className="flex justify-end mb-4">
          <ShoppingCart.Cart />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {!isLoading &&
            products?.map((result) => {
              const productPrice = (result.attributes.price || 0) / 100;

              return (
                <div key={result.attributes.id}>
                  <img
                    src={result.attributes.image_url}
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

                  <ShoppingCart.AddItem item={result} />
                </div>
              );
            })}
        </div>
      </div>
    </ShoppingCart>
  );
};

export { Products };
