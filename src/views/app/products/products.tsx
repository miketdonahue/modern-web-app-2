import React from 'react';
import { useGetProducts } from '@modules/queries/products';
import { ShoppingCart } from '@features/shopping-cart';

const Products = () => {
  const [cartOpen, setCartOpen] = React.useState(false);

  const { data: response, isLoading } = useGetProducts();
  const products = response?.data;

  return (
    <ShoppingCart>
      <div className="my-4 mx-8">
        <div className="flex justify-end mb-4">
          <ShoppingCart.Cart
            isOpen={cartOpen}
            onVisibleChange={(bool) => setCartOpen(bool)}
          />
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

                  <ShoppingCart.AddItem
                    item={result}
                    onAdd={() => setCartOpen(true)}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </ShoppingCart>
  );
};

export { Products };
