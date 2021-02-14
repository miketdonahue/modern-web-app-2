import { CartProduct } from '@typings/api/product';

/**
 * Get the total dollar amount of the cart items
 */
export const getCartTotal = (items: CartProduct[] = []) =>
  items.reduce((acc: number, item: CartProduct) => {
    let result = acc;

    result += ((item.attributes.price || 0) * item.attributes?.quantity) / 100;

    return Number(result.toFixed(2));
  }, 0);

/**
 * Get the total quantity of items in the cart
 */
export const calculateQuantity = (items: CartProduct[]) =>
  items?.reduce((acc, item) => {
    let result = acc;
    result += item.attributes?.quantity;
    return result;
  }, 0);
