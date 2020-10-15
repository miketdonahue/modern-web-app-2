import React from 'react';
import Link from 'next/link';
import { GetProduct } from '@typings/stripe';
import { Cart, Button, Drawer } from '@components/app';

type ShoppingCart = {
  items: GetProduct[];
  total: number;
};

export const ShoppingCart = ({ items, total }: ShoppingCart) => {
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
