import { Request, Response } from 'express';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { ApiResponseWithData } from '@modules/api-response';
import { Product } from '@typings/entities/product';

/**
 * Get an actor's courses
 */
const getActorCourses = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor.id;

  logger.info("ACTOR-CONTROLLER: Getting the actor's courses");

  const courses: Partial<Product[]> = await db.query(
    `
      SELECT
        product.id,
        product.vendor_id,
        product.name,
        product.slug,
        product.image_url,
        product.description
      FROM customer
        JOIN purchase ON purchase.customer_id = customer.id
        JOIN purchase_item ON purchase_item.purchase_id = purchase.id
        JOIN product ON product.id = purchase_item.product_id
      WHERE
        actor_id = $1
      GROUP BY
        product.id,
        product.vendor_id,
        product.name,
        product.slug,
        product.image_url,
        product.description;
    `,
    [actorId]
  );

  const transformedCourses = courses.map((course) => ({
    attributes: { ...course },
  }));

  const response: ApiResponseWithData<Partial<Product>> = {
    data: transformedCourses,
  };

  return res.json(response);
};

export { getActorCourses };
