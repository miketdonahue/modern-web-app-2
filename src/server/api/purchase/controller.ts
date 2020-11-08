import { Request, Response } from 'express';
import { logger } from '@server/modules/logger';
import { getManager } from '@server/modules/db-manager';
import { Purchase } from '@server/entities/purchase';
import { Actor } from '@server/entities/actor';
import { Customer } from '@server/entities/customer';
import { ApiResponseWithError } from '@modules/api-response';
import { errorTypes } from '@server/modules/errors';
import { GetPurchaseResponse } from '@typings/api/purchase';

/**
 * Get purchase orders
 */
const getPurchases = async (req: Request, res: Response) => {
  const db = getManager();
  const actorId = (req as any).actor?.id;
  const orderNumber = req.query.order_number;

  const actor = await db.findOne(Actor, { id: actorId });
  const customer = await db.findOne(Customer, { actor_id: actor?.id });
  const purchases = await db.find(Purchase, {
    order_number: orderNumber as string,
    customer_id: customer?.id,
  });

  if (!actor || !customer || !purchases) {
    const errorResponse: ApiResponseWithError = {
      error: [
        {
          status: errorTypes.PURCHASE_NOT_FOUND.status,
          code: errorTypes.PURCHASE_NOT_FOUND.code,
          detail: errorTypes.PURCHASE_NOT_FOUND.detail,
        },
      ],
    };

    logger.error({ actorId }, 'PURCHASE-CONTROLLER: Could not find purchases');
    return res.status(errorTypes.PURCHASE_NOT_FOUND.status).json(errorResponse);
  }

  const transformedPurchases = purchases.map((purchase) => {
    return {
      attributes: { ...purchase },
      relationships: {
        actor: { ...actor },
      },
    };
  });

  const response: GetPurchaseResponse = {
    data: transformedPurchases,
  };

  return res.json(response);
};

export { getPurchases };
