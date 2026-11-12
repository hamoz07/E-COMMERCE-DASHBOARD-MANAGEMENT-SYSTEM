import PropTypes from "prop-types";
import useCart from "../../hooks/cart/useCart.js";
import CartItemList from "./CartItemsList";
import Button from "../../components/ui/Button/Button.jsx";

const CartContent = ({ onCompleted }) => {
  const {
    products,
    loading,
    error,
    removeItemHandler,
    changeQuantityHandler,
    clearCartHandler,
    isCartMutationPending,
    isCartItemMutationPending,
    cartActionError,
    isCartClearingPending,
  } = useCart();

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p role="alert">Unable to load your cart.</p>;
  }

  if (products.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <>
      {cartActionError?.id === null && (
        <p role="alert" className="text-danger">
          {cartActionError.message}
        </p>
      )}
      <CartItemList
        products={products}
        changeQuantityHandler={changeQuantityHandler}
        removeItemHandler={removeItemHandler}
        isCartItemMutationPending={isCartItemMutationPending}
        cartActionError={cartActionError}
      />
      <Button
        variant="danger"
        type="button"
        loading={isCartClearingPending}
        loadingText="Clearing..."
        onClick={() => clearCartHandler(onCompleted)}
        disabled={isCartClearingPending || isCartMutationPending}
      >
        Clear cart
      </Button>
    </>
  );
};

CartContent.propTypes = {
  onCompleted: PropTypes.func,
};

CartContent.defaultProps = {
  onCompleted: undefined,
};

export default CartContent;
