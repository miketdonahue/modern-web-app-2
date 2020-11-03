import React from 'react';
import { Button } from '@components/app';

export const OrderComplete = () => {
  return (
    <div>
      <h1 className="text-3xl">Thank you for your purchase.</h1>
      <div>
        We&rsquo;ve emailed a receipt of your purchase to: mike@mail.com.
      </div>
      <div>Order number: #123</div>
      <div>Your book is ready to download</div>
      <Button href="/app/account/my-books">Go to My Books</Button>
    </div>
  );
};
