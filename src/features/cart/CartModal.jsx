import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import CartContent from "./CartContent";

const CartModal = ({ onHide }) => {
  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <CartContent onCompleted={onHide} />
      </Modal.Body>
    </Modal>
  );
};

CartModal.propTypes = {
  onHide: PropTypes.func.isRequired,
};

export default CartModal;