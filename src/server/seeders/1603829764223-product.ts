import { MigrationInterface, getManager } from 'typeorm';
import Stripe from 'stripe';
import { Product } from '@server/entities/product';

const stripe = new Stripe(process.env.STRIPE || '', {
  apiVersion: '2020-08-27',
});

export class Product1603829764223 implements MigrationInterface {
  public up = async (): Promise<any> => {
    const db = getManager('seed');

    const stripePrices = await stripe.prices.list({
      expand: ['data.product'],
    });

    const products = stripePrices.data.map((item: any) => {
      return {
        vendor_id: item.product.id,
        name: item.product.name,
        image_url: `http://localhost:8080/images/products/${item.product.id}.jpg`,
        description: item.product.description || '',
        short_description: item.product.description || '',
        statement_descriptor: item.product.statement_descriptor || '',
        price: item.unit_amount || 0,
      };
    });

    await db.insert(Product, products);
  };

  public down = async (): Promise<any> => {};
}
