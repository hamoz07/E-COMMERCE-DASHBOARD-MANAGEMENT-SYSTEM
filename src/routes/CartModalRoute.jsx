import { useNavigate } from "react-router-dom";
import CartModal from "../features/cart/CartModal.jsx";

const CartModalRoute = () => {
  const navigate = useNavigate();

  return <CartModal onHide={() => navigate(-1)} />;
};

export default CartModalRoute;
