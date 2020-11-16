import { Request, Response, NextFunction } from 'express';
import { logger } from '@server/modules/logger';
import { getManager } from '@server/modules/db-manager';
import { Product } from '@server/entities/product';
import { ProductVideo } from '@server/entities/product-video';
import { ApiResponseWithData } from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';

/**
 * Get a product's videos
 */
const getProductVideos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = getManager();
  const actorId = (req as any).actor?.id;
  const productSlug = req.query.product_slug;

  const product = await db.findOne(Product, { where: { slug: productSlug } });

  const [actorHasAccessToProduct] = await db.query(
    `
      SELECT
        *
      FROM actor
        JOIN customer ON customer.actor_id = actor.id
        JOIN purchase ON purchase.customer_id = customer.id
        JOIN purchase_item ON purchase_item.purchase_id = purchase.id
      WHERE
        actor.id = $1
        AND purchase_item.product_id = $2;
  `,
    [actorId, product?.id]
  );

  if (!actorHasAccessToProduct) {
    logger.error(
      { actorId },
      'PRODUCT-VIDEOS-CONTROLLER: Actor is not authorized to view this course'
    );

    return next({
      status: errorTypes.UNAUTHORIZED.status,
      code: errorTypes.UNAUTHORIZED.code,
      detail: errorTypes.UNAUTHORIZED.detail,
    });
  }

  const productVideos = await db.find(ProductVideo, {
    product_id: product?.id,
  });

  const transformedProductVideos = productVideos.map((video) => {
    return {
      attributes: { ...video },
    };
  });

  const response: ApiResponseWithData<Partial<ProductVideo>> = {
    data: transformedProductVideos,
  };

  return res.json(response);
};

export { getProductVideos };
