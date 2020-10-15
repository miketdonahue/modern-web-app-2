import React from 'react';
import Link from 'next/link';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { Cart, Button, Drawer } from '@components/app';

type ShoppingCart = {};

export const ShoppingCart = () => {
  const { items, total } = useShoppingCart();

  // TODO: Cart items do not update here. Need to force a re-render, or put a context on outside

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Cart count={items.length} onClick={() => setOpen(true)} />

      {/* Drawer */}
      <Drawer isOpen={open} onClose={() => setOpen(false)}>
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
      </Drawer>
    </>
  );
};
