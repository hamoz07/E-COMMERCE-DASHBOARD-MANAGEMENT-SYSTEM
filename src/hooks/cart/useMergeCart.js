import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AX } from "../../api/client.js";

const mergeCart = async ({ items, idempotencyKey }) => {
  const response = await AX.post(
    "/cart/merge",
    { items },
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  return response.data;
};

export const createCartMergeIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `cart-merge-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const useMergeCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mergeCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });
};
