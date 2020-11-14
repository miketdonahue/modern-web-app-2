import Stripe from 'stripe';
import { createConnection, getManager } from 'typeorm';
import { Product } from '@server/entities/product';

const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
});

/* INPUTS */
const attributes = {
  product: {
    name: 'Test Course',
    filename: 'test-course',
    image_url:
      'https://images.unsplash.com/photo-1567606404839-dea8cec4d278?ixlib=rb-1.2.1&auto=format&fit=crop&w=749&q=80',
    description:
      'Donec vulputate et massa ut vehicula. Quisque efficitur justo id purus posuere pretium.',
    statement_descriptor: 'TEST COURSE',
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
    description: attributes.product.description,
    statement_descriptor: attributes.product.statement_descriptor,
    images: [attributes.product.image_url],
  });

  /* Create product in own database */
  const newProduct = await db.create(Product, {
    vendor_id: createdStripeProduct.id,
    name: attributes.product.name,
    filename: attributes.product.filename,
    image_url: attributes.product.image_url,
    description: attributes.product.description,
    statement_descriptor: attributes.product.statement_descriptor,
    price: attributes.price.amount,
  });

  const savedProduct = await db.save(newProduct);

  /* Update product w/ metadata */
  await stripe.products.update(createdStripeProduct.id, {
    metadata: { internal_id: savedProduct.id, filename: savedProduct.filename },
  });

  /* Create Stripe price to attach to Stripe product */
  await stripe.prices.create({
    product: createdStripeProduct.id,
    currency: attributes.price.currency,
    unit_amount: attributes.price.amount,
  });
};

createProduct();
