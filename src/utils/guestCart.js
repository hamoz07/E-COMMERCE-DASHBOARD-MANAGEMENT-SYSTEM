export const getGuestCartItems = (items) =>
  Object.entries(items).map(([productId, count]) => ({
    product_id: Number(productId),
    count,
  }));
