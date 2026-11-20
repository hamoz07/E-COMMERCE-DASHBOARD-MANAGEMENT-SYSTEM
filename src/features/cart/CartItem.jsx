import { memo } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/ui/Button/Button.jsx";

const CartItem = memo(
  ({
    id,
    title,
    img,
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

    // console.log("image",product?.image);

    return (
      <div
        className="cart-item"
      >
        <div className="cart-item__details">
          {img && (
            <img
              className="cart-item__image"
              src={img}
              alt={title || "Product"}
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="cart-item__summary">
            <h6 className="cart-item__title">{title}</h6>
            <div className="cart-item__price">
              ${Number(price || 0).toFixed(2)} each
              <span aria-hidden="true"> • </span>
              <strong>
                ${(Number(price || 0) * Number(quantity || 0)).toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        <div className="cart-item__actions">
          {actionError && (
            <p role="alert" className="text-danger">
              {actionError.message}
            </p>
          )}
          {availableStock > 0 ? (
            <>
              <Form.Select
                className="cart-item__quantity"
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
          <Button
            variant="icon"
            type="button"
            size="small"
            iconOnly
            ariaLabel={`Remove ${title || "product"} from cart`}
            className="cart-item__remove"
            onClick={() => removeItemHandler(id)}
            disabled={isItemMutationPending}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
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
  img: PropTypes.string,
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
