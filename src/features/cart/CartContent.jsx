import PropTypes from "prop-types";
import useCart from "../../hooks/cart/useCart.js";
import CartItemList from "./CartItemsList";
import Button from "../../components/ui/Button/Button.jsx";
import "./cart.css";

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
    return (
      <p role="status" >
        Loading cart...
      </p>
    );
  }

  if (error) {
    return <p role="alert">Unable to load your cart.</p>;
  }

  if (products.length === 0) {
    return <p className="cart-content__empty">Your cart is empty.</p>;
  }

  const totalAmount = products.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  return (
    <div className="cart-content">
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
      <div className="cart-content__footer">
        <div className="cart-content__total">
          <span>Total</span>
          <strong>${totalAmount.toFixed(2)}</strong>
        </div>
        <Button
          variant="danger"
          type="button"
          loading={isCartClearingPending}
          loadingText="Clearing..."
          onClick={() => clearCartHandler(onCompleted)}
          disabled={isCartClearingPending || isCartMutationPending}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  );
};

CartContent.propTypes = {
  onCompleted: PropTypes.func,
};

CartContent.defaultProps = {
  onCompleted: undefined,
};

export default CartContent;
