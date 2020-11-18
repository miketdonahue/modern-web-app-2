import { Request, Response, NextFunction } from 'express';
import { logger } from '@server/modules/logger';
import { getManager } from '@server/modules/db-manager';
import { Product } from '@server/entities/product';
import { ProductVideo } from '@server/entities/product-video';
import { ProductVideoActor } from '@server/entities/product-video-actor';
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
  const lessonSlug = req.query.lesson_slug;
  let product;

  if (productSlug) {
    product = await db.findOne(Product, { where: { slug: productSlug } });
  }

  if (lessonSlug) {
    [product] = await db.query(
      `
        SELECT product.*
        FROM product_video
          JOIN product ON product.id = product_video.product_id
        WHERE product_video.slug = $1
        LIMIT 1;
      `,
      [lessonSlug]
    );
  }

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

  const productVideos: ProductVideo & { watched: boolean }[] = await db.query(
    `
      SELECT
        product_video.*,
        COALESCE ( product_video_actor.watched, FALSE ) as watched
      FROM product_video
        LEFT JOIN product_video_actor ON product_video_actor.product_video_id = product_video.ID
      WHERE
        product_id = $1
      ORDER BY product_video.ordering ASC;
    `,
    [product?.id]
  );

  const transformedProductVideos = productVideos.map((video) => {
    return {
      attributes: { ...video },
      meta: {
        watched: video.watched,
      },
    };
  });

  const response: ApiResponseWithData<Partial<
    ProductVideo & { watched: boolean }
  >> = {
    data: transformedProductVideos,
  };

  return res.json(response);
};

/**
 * Set a product's video to watched for a given actor
 */
const setProductVideoWatched = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor?.id;
  const productVideoId = req.params.id;

  const existingRecord = await db.findOne(ProductVideoActor, {
    where: {
      actor_id: actorId,
      product_video_id: productVideoId,
      watched: true,
    },
  });

  if (!existingRecord) {
    const newRecord = db.create(ProductVideoActor, {
      actor_id: actorId,
      product_video_id: productVideoId,
      watched: true,
    });

    const savedRecord = await db.save(newRecord);

    const response: ApiResponseWithData<Partial<ProductVideoActor>> = {
      data: { attributes: { ...savedRecord } },
    };

    return res.json(response);
  }

  return res.end();
};

export { getProductVideos, setProductVideoWatched };
