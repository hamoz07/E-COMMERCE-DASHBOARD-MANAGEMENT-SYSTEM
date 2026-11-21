/* eslint-disable react/prop-types */
import { Card, Row, Col } from "react-bootstrap";
import Button from "../../../components/ui/Button/Button.jsx";
import ProdCart from "../../../assets/cart.jpeg";
import { Textreplacer } from "../../../utils/TextReplacer";
import { NavLink } from "react-router-dom";
import { StarRating } from "../../../components/ui/StarRating/StarRating.jsx";
import useAddToCart from "../../../hooks/cart/useAddToCart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Image from "../../../components/ui/Image/Image.jsx";

const Product = (props) => {
  const {
    addCartHandler,
    isDisabled,
    isAdding,
    cartError,
    availableToAdd,
    isCheckingAvailability,
  } = useAddToCart(props.product.id, props.product);

  console.log(props.product , "props.product");

  return (
    <NavLink
      to={`/product/${props.product.id}`}
      className={`col-lg-${props.size} col-md-6 col-12 h-100`}
    >
      <Card className="h-100 shadow-sm border-1 rounded-3">
        <div
          className="position-relative d-flex align-items-center justify-content-center border-bottom"
          style={{ height: "220px" }}
        >
          {props.product.sale && (
            <span className="m-0 py-1 px-2 position-absolute top-0 start-0 bg-primary rounded-circle text-white text-uppercase d-inline-block text-center">
              sale
            </span>
          )}

          <Image
            src={props.product.img}
            alt={`${props.product.title} image`}
            width={300}
            height={170}
            className="h-100 p-1"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            srcSetWidths={[320, 640, 960]}
            objectFit="cover"
            style={{
              width: "100%",
              height: "170px",
            }}
          />
        </div>

        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Subtitle className="mb-2 text-muted">
              {Textreplacer(props.product.title, 35)}
            </Card.Subtitle>
            <Card.Text
              className="mb-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {props.product.desc}
            </Card.Text>
          </div>

          <div>
            <Row className="align-items-center mb-3">
              <Col xs={6}>
                <h5 className="m-0 text-primary">{props.product.price}$</h5>
                <small className="text-decoration-line-through">
                  {props.product.discount}$
                </small>
              </Col>
              <Col xs={6} className="text-end">
                <StarRating rating={props.product.rating} />
              </Col>
            </Row>

            <Button
              variant="primary"
              fullWidth
              disabled={isDisabled}
              loading={isAdding}
              loadingText="Adding..."
              onClick={(e) => {
                e.preventDefault(); // prevent NavLink navigation on button click
                addCartHandler();
              }}
              leftIcon={ <FontAwesomeIcon icon={faCartShopping}  />}
            >
              {isCheckingAvailability
                ? "Checking availability..."
                : availableToAdd >= 1
                  ? "Add to Cart"
                  : "Out of Stock"}
            </Button>

            {cartError && (
              <p className="text-danger small mt-1 px-3">{cartError}</p>
            )}
          </div>
        </Card.Body>
      </Card>
    </NavLink>
  );
};

export default Product;
