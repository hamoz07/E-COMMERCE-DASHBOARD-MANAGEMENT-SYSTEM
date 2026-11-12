import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/cart/cartSlice";
import { useAddCartMutation } from "./useAddCartMutation.js";
import { isAuthenticated } from "../../api/auth.js";
import { useCurrentUser } from "../../context/currentUserContext.jsx";
import { useProduct } from "../products/useProduct.js";
import { AX } from "../../api/client.js";
import { addToast } from "../../store/toasts/toastSlice";

const useAddToCart = (prodId) => {
  const [count, setCount] = useState(1);
  const [cartError, setCartError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const guestCartItems = useAppSelector((state) => state.cart.items);
  const { currentUser } = useCurrentUser();
  const addCartMutation = useAddCartMutation();
  const authenticated = isAuthenticated();

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProduct(prodId);

  const { data: cartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ["cartItems", currentUser?.id],
    queryFn: async ({ signal }) => {
      const response = await AX.get("/cart", { signal });
      return response.data;
    },
    enabled: authenticated && Boolean(currentUser?.id),
  });

  // derived values — computed every render from current state
  const currentCartQuantity = authenticated
    ? Number(
        cartItems.find(
          (item) => String(item.product_id) === String(product?.id),
        )?.count || 0,
      )
    : Number(guestCartItems[product?.id] || 0);

  const availableToAdd = product
    ? Math.max(0, (Number(product.stock) || 0) - currentCartQuantity)
    : null;

  const isDisabled =
    !product ||
    (authenticated && isCartLoading) ||
    availableToAdd < 1 ||
    addCartMutation.isPending;

  // count management
  const increment = () => {
    if (!availableToAdd || count >= availableToAdd) return;
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    if (count <= 1) return;
    setCount((prev) => prev - 1);
  };

  const resetCount = () => setCount(1);

  // main handler
  const addCartHandler = () => {
    if (!product) return;

    if (availableToAdd < 1 || count > availableToAdd) {
      dispatch(
        addToast({
          title: "Cart",
          type: "warning",
          message:
            availableToAdd < 1
              ? "This product is out of stock."
              : `Only ${availableToAdd} item${availableToAdd === 1 ? "" : "s"} available to add.`,
        }),
      );
      setCartError(
        availableToAdd < 1
          ? "This product is out of stock."
          : `Only ${availableToAdd} item${availableToAdd === 1 ? "" : "s"} available to add.`,
      );
      return;
    }

    if (!authenticated) {
      dispatch(addToCart({ id: String(product.id), quantity: count }));
      dispatch(
        addToast({
          title: "Added to cart",
          type: "success",
          message: `${product.title} was added to your cart.`,
        }),
      );
      setCartError("");
      resetCount();
      navigate("/cart", { state: { backgroundLocation: location } });
      return;
    }

    addCartMutation.mutate(
      { productId: product.id, count, product, userId: currentUser?.id },
      {
        onSuccess: () => {
          dispatch(
            addToast({
              title: "Added to cart",
              type: "success",
              message: `${product.title} was added to your cart.`,
            }),
          );
          setCartError("");
          resetCount();
          navigate("/cart", { state: { backgroundLocation: location } });
        },
        onError: (error) => {
          const validationErrors = error.response?.data?.errors;
          const message =
            error.response?.data?.error ||
            (validationErrors &&
              Object.values(validationErrors).flat().join(" ")) ||
            "Unable to add this product to the cart.";
          setCartError(message);
          dispatch(
            addToast({
              title: "Unable to add to cart",
              type: "danger",
              message,
            }),
          );
        },
      },
    );
  };

  return {
    // state
    count,
    cartError,
    // product data
    product,
    productLoading,
    productError,
    // cart state
    availableToAdd,
    isDisabled,
    isAdding: addCartMutation.isPending,
    // handlers
    addCartHandler,
    increment,
    decrement,
  };
};

export default useAddToCart;