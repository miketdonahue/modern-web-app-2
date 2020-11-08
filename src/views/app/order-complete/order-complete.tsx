import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@components/app';
import { useGetPurchases } from '@modules/queries/purchases';

export const OrderComplete = () => {
  const router = useRouter();
  const { data: purchases } = useGetPurchases(
    {
      orderNumber: router.query.order_number as string,
    },
    { enabled: router.query.order_number }
  );

  const purchase = purchases?.data[0];

  return (
    <div>
      <h1 className="text-3xl">Thank you for your purchase.</h1>
      <div>
        We&rsquo;ve emailed a receipt of your purchase to:{' '}
        {purchase?.relationships?.actor.email}.
      </div>
      <div>Order number: #{purchase?.attributes.order_number}</div>
      <div>Your book is ready to download</div>
      <Button href="/app/account/my-books">Go to My Books</Button>
    </div>
  );
};
