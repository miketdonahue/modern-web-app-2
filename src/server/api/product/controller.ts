import { Request, Response } from 'express';
import { getManager } from '@server/modules/db-manager';
import { ApiResponseWithData } from '@modules/api-response';
import { Product } from '@server/entities/product';

/**
 * Get all products
 */
const getProducts = async (req: Request, res: Response) => {
  const db = getManager();

  const products = await db.find(Product, { deleted: false });
  const productsForResponse = products.map((product: any) => {
    return {
      id: product.id,
      attributes: {
        name: product.name,
        shortDescription: product.short_description,
        thumbnail: product.thumbnail,
        image: product.image,
        price: product.price,
      },
    };
  });

  const response: ApiResponseWithData<Product> = {
    data: [...productsForResponse],
  };

  return res.json(response);
};

export { getProducts };
