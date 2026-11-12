import { memo } from "react";
import PropTypes from "prop-types";
// import ProductInfo from "../ProductInfo/ProductInfo";
import { Form } from "react-bootstrap";
import Button from "../../components/ui/Button/Button.jsx";
// import styles from "./styles.module.css";

// const { cartItem, cartItemSelection } = styles;

const CartItem = memo(
  ({
    id,
    title,
    price,
    stock,
    quantity,
    changeQuantityHandler,
    removeItemHandler,
    isCartItemMutationPending,
    actionError,
  }) => {
    const isItemMutationPending = isCartItemMutationPending(id);
    const availableStock = Number(stock) || 0;
    const renderOptions = Array.from({ length: availableStock }, (_, idx) => {
      const optionQuantity = idx + 1;
      return (
        <option value={optionQuantity} key={optionQuantity}>
          {optionQuantity}
        </option>
      );
    });

    // if current quantity exceeds what's available, surface it instead of locking the UI
    const quantityExceedsStock =
      quantity > availableStock && availableStock > 0;

    const changeQuantity = (event) => {
      const quantity = +event.target.value;
      changeQuantityHandler(id, quantity);
    };

    return (
      <div
      //   className={cartItem}
      >
        {title} : {price}$
        {/* <ProductInfo title={title} price={price} img={img} direction="column"> */}
        <Button
          variant="secondary"
          type="button"
          size="small"
          style={{ color: "white", width: "100px" }}
          className="mt-auto"
          onClick={() => removeItemHandler(id)}
          disabled={isItemMutationPending}
        >
          Remove
        </Button>
        {/* </ProductInfo> */}
        <div
        // className={cartItemSelection}
        >
          <span className="d-block mb-1">Quantity</span>
          {actionError && (
            <p role="alert" className="text-danger">
              {actionError.message}
            </p>
          )}
          {availableStock > 0 ? (
            <>
              <Form.Select
                value={quantity}
                onChange={changeQuantity}
                disabled={isItemMutationPending}
                isInvalid={quantityExceedsStock}
              >
                {renderOptions}
              </Form.Select>
              {quantityExceedsStock && (
                <p className="text-danger small mt-1">
                  Only {availableStock} left — please update quantity.
                </p>
              )}
            </>
          ) : (
            <p role="alert">This product is out of stock.</p>
          )}
        </div>
      </div>
    );
  },
);

export default CartItem;
CartItem.displayName = "CartItem";

CartItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  changeQuantityHandler: PropTypes.func.isRequired,
  removeItemHandler: PropTypes.func.isRequired,
  isCartItemMutationPending: PropTypes.func.isRequired,
  actionError: PropTypes.shape({
    message: PropTypes.string,
  }),
};
