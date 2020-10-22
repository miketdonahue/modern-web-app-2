import { Request, Response } from 'express';
import { getManager } from '@server/modules/db-manager';
import { ApiResponseWithData } from '@modules/api-response';
import { Product } from '@server/entities/product';

/**
 * Get all products
 */
const getProducts = async (req: Request, res: Response) => {
  const db = getManager();

  const products = await db.find(Product, {});
  const transformedProducts = products.map((product) => {
    return {
      attributes: { ...product },
    };
  });

  const response: ApiResponseWithData<Partial<Product>> = {
    data: transformedProducts,
  };

  return res.json(response);
};

export { getProducts };
