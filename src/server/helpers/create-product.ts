import Stripe from 'stripe';
import { createConnection, getManager } from 'typeorm';
import { Product } from '@server/entities/product';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-08-27',
});

/* INPUTS */
const attributes = {
  product: {
    name: 'Wild Game: My Mother, Her Secret, and Me',
    image_url:
      'https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/08/gettyimages-464163411.jpg?crop=1.0xw:1xh;center,top&resize=980:*',
    description:
      'Donec vulputate et massa ut vehicula. Quisque efficitur justo id purus posuere pretium.',
    short_description:
      'Donec vulputate et massa ut vehicula. Quisque efficitur justo id purus posuere pretium.',
    statement_descriptor: 'PRODUCT 1',
  },
  price: {
    currency: 'usd',
    amount: 999, // in cents
  },
};

const createProduct = async () => {
  await createConnection('development');
  const db = getManager('development');

  /* Create Stripe product */
  const createdStripeProduct = await stripe.products.create({
    name: attributes.product.name,
    description: attributes.product.short_description,
    statement_descriptor: attributes.product.statement_descriptor,
    images: [attributes.product.image_url],
  });

  /* Create product in own database */
  const newProduct = await db.create(Product, {
    vendor_id: createdStripeProduct.id,
    name: attributes.product.name,
    image_url: attributes.product.image_url,
    description: attributes.product.description,
    short_description: attributes.product.short_description,
    statement_descriptor: attributes.product.statement_descriptor,
    price: attributes.price.amount,
  });

  const savedProduct = await db.save(newProduct);

  /* Update product w/ metadata */
  await stripe.products.update(createdStripeProduct.id, {
    metadata: { internal_id: savedProduct.id },
  });

  /* Create Stripe price to attach to Stripe product */
  await stripe.prices.create({
    product: createdStripeProduct.id,
    currency: attributes.price.currency,
    unit_amount: attributes.price.amount,
  });
};

createProduct();
