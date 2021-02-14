export const calculateOrderTotal = (
  items: { quantity: number; price: number }[]
) =>
  items.reduce((acc: number, item: { quantity: number; price: number }) => {
    let result = acc;
    result += item.quantity * (item.price * 100);
    return result;
  }, 0);

export const sum = (items: number[]) =>
  items.reduce((acc: number, item: number) => {
    let result = acc;
    result += item;
    return result;
  }, 0);
