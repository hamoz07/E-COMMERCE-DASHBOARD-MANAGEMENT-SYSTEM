import { AX } from "./client.js";

export const fetchProductsByItems = async (itemsIds) => {
  if (!itemsIds.length) return [];
  
  const concatenatedItemsId = itemsIds.map((el) => `id=${el}`).join("&");
  const response = await AX.get(`/products?${concatenatedItemsId}`);
  
  return response.data;
};