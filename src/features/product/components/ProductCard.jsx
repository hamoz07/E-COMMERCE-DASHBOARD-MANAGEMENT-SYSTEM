/* eslint-disable react/prop-types */
import { Card, Row, Col } from "react-bootstrap";
import Button from "../../../components/ui/Button/Button.jsx";
import ProdCart from "../../../assets/cart.jpeg";
import { Textreplacer } from "../../../utils/TextReplacer";
import { NavLink } from "react-router-dom";
import { StarRating } from "../../../components/ui/StarRating/StarRating.jsx";
import useAddToCart from "../../../hooks/cart/useAddToCart.js";

const Product = (props) => {
  const { addCartHandler, isDisabled, isAdding, cartError, availableToAdd } =
    useAddToCart(props.id);

  return (
    <NavLink
      to={`/product/${props.id}`}
      className={`col-lg-${props.size} col-md-6 col-12`}
    >
      <Card className="h-100 shadow-sm border-1 rounded-3">
        <div
          className="position-relative d-flex align-items-center justify-content-center border-bottom"
          style={{ height: "220px" }}
        >
          {props.sale && (
            <span className="m-0 py-1 px-2 position-absolute top-0 start-0 bg-primary rounded-circle text-white text-uppercase d-inline-block text-center">
              sale
            </span>
          )}
          {/* <Card.Img src={props.img} alt={`${props.title} image`} className="h-100 object-fit-contain p-3" /> */}

          <div
            className="h-100 object-fit-contain p-3"
            style={{
              backgroundImage: `url(${props.img})`,
              backgroundSize: "cover",
              height: "170px",
              width: 200,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>

        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Subtitle className="mb-2 text-muted">
              {Textreplacer(props.title, 35)}
            </Card.Subtitle>
            <Card.Text className="mb-3">{props.desc}</Card.Text>
          </div>

          <div>
            <Row className="align-items-center mb-3">
              <Col xs={6}>
                <h5 className="m-0 text-primary">{props.price}$</h5>
                <small className="text-decoration-line-through">
                  {props.discount}$
                </small>
              </Col>
              <Col xs={6} className="text-end">
                <StarRating rating={props.rating} />
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
              leftIcon={<img src={ProdCart} alt="" width={24} height={24} />}
            >
               {availableToAdd === null
    ? "Loading..."
    : availableToAdd < 1
      ? "Out of Stock"
      : "Add to Cart"}
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
