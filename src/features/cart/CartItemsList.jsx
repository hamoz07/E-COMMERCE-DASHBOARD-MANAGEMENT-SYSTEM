import CartItem from "./CartItem";
import PropTypes from "prop-types";

const CartItemList = ({
  products,
  changeQuantityHandler,
  removeItemHandler,
  isCartItemMutationPending,
  cartActionError,
}) => {
  const renderList = products?.map((el) => (
    <CartItem
      key={el.id}
      {...el}
      changeQuantityHandler={changeQuantityHandler}
      removeItemHandler={removeItemHandler}
      isCartItemMutationPending={isCartItemMutationPending}
      actionError={
        cartActionError &&
        String(cartActionError.id) === String(el.id)
          ? cartActionError
          : null
      }
    />
  ));

  return <div>{renderList}</div>;
};

export default CartItemList;

CartItemList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeQuantityHandler: PropTypes.func.isRequired,
  removeItemHandler: PropTypes.func.isRequired,
  isCartItemMutationPending: PropTypes.func.isRequired,
  cartActionError: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};
