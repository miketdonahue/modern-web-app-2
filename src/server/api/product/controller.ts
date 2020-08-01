import { Request, Response } from 'express';
import { getManager } from '@server/modules/db-manager';
import { resourceTypes, ApiResponseWithData } from '@modules/api-response';
import { Product } from '@server/entities/product';
import { config } from '@config';

/**
 * Get all products
 */
const getProducts = async (req: Request, res: Response) => {
  const db = getManager();

  const products = await db.find(Product, { deleted: false });
  const productsForResponse = products.map((product: any) => {
    return {
      id: product.uuid,
      type: resourceTypes.PRODUCT,
      attributes: {
        name: product.name,
        shortDescription: product.short_description,
        thumbnail: product.thumbnail,
        image: product.image,
        price: product.price,
      },
      links: {
        self: `${config.server.domain}/api/v1/products/${product.uuid}`,
      },
    };
  });

  const response: ApiResponseWithData = {
    data: [...productsForResponse],
    links: {
      self: `${config.server.domain}/api/v1/products`,
    },
  };

  return res.json(response);
};

export { getProducts };
