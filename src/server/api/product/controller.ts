import AWS from 'aws-sdk';
import { Request, Response } from 'express';
import { logger } from '@server/modules/logger';
import { getManager } from '@server/modules/db-manager';
import { Product } from '@server/entities/product';
import {
  ApiResponseWithData,
  ApiResponseWithError,
} from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';

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

/**
 * Download a product
 */
const downloadProduct = async (req: Request, res: Response) => {
  const db = getManager();
  const s3 = new AWS.S3();
  const { id } = req.params;

  const product = await db.findOne(Product, { id });

  if (product) {
    const url = s3.getSignedUrl('getObject', {
      Bucket: 'tiny-series-ebooks',
      Key: product?.slug,
      Expires: 60,
    });

    const response: ApiResponseWithData<{ url: string; slug: string }> = {
      data: { attributes: { url, slug: product.slug } },
    };

    return res.json(response);
  }

  const errorResponse: ApiResponseWithError = {
    error: [
      {
        status: errorTypes.PRODUCT_NOT_FOUND.status,
        code: errorTypes.PRODUCT_NOT_FOUND.code,
        detail: errorTypes.PRODUCT_NOT_FOUND.detail,
      },
    ],
  };

  logger.error({ id }, 'PRODUCT-CONTROLLER: Could not find product');
  return res.status(errorTypes.PRODUCT_NOT_FOUND.status).json(errorResponse);
};

export { getProducts, downloadProduct };
