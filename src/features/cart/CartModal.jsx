import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import CartContent from "./CartContent";
import './cart.css';
const CartModal = ({ onHide }) => {
  return (
    <Modal show onHide={onHide} dialogClassName="cart-modal">
      <Modal.Header closeButton className="cart-modal__header">
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>

      <Modal.Body className="cart-modal__body">
        <CartContent onCompleted={onHide} />
      </Modal.Body>
    </Modal>
  );
};

CartModal.propTypes = {
  onHide: PropTypes.func.isRequired,
};

export default CartModal;