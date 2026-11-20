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

const useAddToCart = (prodId, providedProduct = null) => {
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
  } = useProduct(prodId, !providedProduct);

  const productData = providedProduct || product;

  const { data: cartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ["cartItems", currentUser?.id],
    queryFn: async ({ signal }) => {
      console.log("test")
      const response = await AX.get("/cart", { signal });
      return response.data;
    },
    enabled: authenticated && Boolean(currentUser?.id),
  });

  // derived values — computed every render from current state
  const currentCartQuantity = authenticated
    ? Number(
        cartItems.find(
          (item) => String(item.product_id) === String(productData?.id),
        )?.count || 0,
      )
    : Number(guestCartItems[productData?.id] || 0);

  const availableToAdd =
    productData && productData.stock != null
      ? Math.max(0, Number(productData.stock) - currentCartQuantity)
      : null;

  const isCheckingAvailability =
    productData?.stock == null || (authenticated && isCartLoading);

  const isDisabled =
    !productData ||
    isCheckingAvailability ||
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
    if (!productData) return;

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
      dispatch(addToCart({ id: String(productData.id), quantity: count }));
      dispatch(
        addToast({
          title: "Added to cart",
          type: "success",
          message: `${productData.title} was added to your cart.`,
        }),
      );
      setCartError("");
      resetCount();
      navigate("/cart", { state: { backgroundLocation: location } });
      return;
    }

    addCartMutation.mutate(
      { productId: productData.id, count, product: productData, userId: currentUser?.id },
      {
        onSuccess: () => {
          dispatch(
            addToast({
              title: "Added to cart",
              type: "success",
              message: `${productData.title} was added to your cart.`,
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
    product: productData,
    productLoading,
    productError,
    // cart state
    availableToAdd,
    isCheckingAvailability,
    isDisabled,
    isAdding: addCartMutation.isPending,
    // handlers
    addCartHandler,
    increment,
    decrement,
  };
};

export default useAddToCart;