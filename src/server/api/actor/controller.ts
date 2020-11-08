import { Request, Response } from 'express';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { ApiResponseWithData } from '@modules/api-response';
import { CartProduct } from '@typings/api/product';

/**
 * Get an actor's books
 */
const getActorBooks = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor.id;

  logger.info("ACTOR-CONTROLLER: Getting the actor's books");

  const books: Partial<CartProduct[]> = await db.query(
    `
      SELECT
        product.ID,
        product.vendor_id,
        product.NAME,
        product.filename,
        product.image_url,
        product.description,
        product.short_description,
        product.price,
        CAST( COUNT(product.ID) AS int) AS quantity
      FROM
        customer
        JOIN purchase ON purchase.customer_id = customer.
        ID JOIN purchase_item ON purchase_item.purchase_id = purchase.
        ID JOIN product ON product.ID = purchase_item.product_id
      WHERE
        actor_id = $1
      GROUP BY
        product.ID,
        product.vendor_id,
        product.NAME,
        product.filename,
        product.image_url,
        product.description,
        product.short_description,
        product.price;
    `,
    [actorId]
  );

  const transformedBooks = books.map((book) => {
    return {
      attributes: { ...book },
    };
  });

  const response: ApiResponseWithData<Partial<CartProduct>> = {
    data: transformedBooks,
  };

  return res.json(response);
};

export { getActorBooks };
