import { Request, Response } from 'express';
import { getManager } from '@server/modules/db-manager';
import { logger } from '@server/modules/logger';
import { ApiResponseWithData } from '@modules/api-response';
import { CartProduct } from '@typings/entities/product';

/**
 * Get an actor's books
 */
const getActorBooks = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor.id;

  logger.info("ACTOR-CONTROLLER: Getting the actor's books");

  const books: CartProduct[] = await db.query(
    `
      SELECT product.*, purchase_item.quantity
      FROM customer
      JOIN purchase on purchase.customer_id = customer.id
      JOIN purchase_item on purchase_item.purchase_id = purchase.id
      JOIN product on product.id = purchase_item.product_id
      WHERE actor_id = $1
    `,
    [actorId]
  );

  const transformedBooks = books.map((book) => {
    return {
      attributes: { ...book },
    };
  });

  const response: ApiResponseWithData<CartProduct> = {
    data: transformedBooks,
  };

  return res.json(response);
};

export { getActorBooks };
