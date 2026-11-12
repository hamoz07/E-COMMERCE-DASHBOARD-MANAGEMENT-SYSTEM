import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AX } from "../../api/client.js";
import { refreshCart } from "./useRefreshCart";

const addCart = async ({ productId, count }) => {
  const response = await AX.post("/cart", {
    product_id: productId,
    count,
  });

  return response.data;
};

export const useAddCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCart,
    onMutate: async ({ productId, count, product, userId }) => {
      const cartQueryKey = ["cartItems", userId];

      await queryClient.cancelQueries({ queryKey: cartQueryKey });

      const previousCart = queryClient.getQueryData(cartQueryKey);

      queryClient.setQueryData(cartQueryKey, (currentCart = []) => {
        const existingItem = currentCart.find(
          (item) => String(item.product_id) === String(productId),
        );

        if (existingItem) {
          return currentCart.map((item) =>
            String(item.product_id) === String(productId)
              ? { ...item, count: item.count + count }
              : item,
          );
        }

        return [
          ...currentCart,
          {
            id: `optimistic-${productId}`,
            product_id: productId,
            count,
            product,
          },
        ];
      });

      return { previousCart };
    },
    onError: (_error, variables, context) => {
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(
          ["cartItems", variables.userId],
          context.previousCart,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      refreshCart(queryClient, variables.productId);
    },
  });
};
