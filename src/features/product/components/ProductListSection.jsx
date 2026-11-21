// components/ProductListSection.jsx
// Pure presentational — just renders what it receives
import PropTypes from "prop-types";
import Product from "./ProductCard.jsx";
import ProductCardSkeleton from "../../../components/skeletons/ProductCardSkeleton.jsx";

const ProductListSection = ({
  products = [],
  isLoading = false,
  isError = false,
  size = 6,
  skeletonCount = 4,
}) => {
  const skeletonCards = Array.from({ length: skeletonCount }, (_, i) => (
    <ProductCardSkeleton key={i} size={size} />
  ));

  return (
    <div className="row g-3">
      {isLoading ? (
        skeletonCards
      ) : isError ? (
        <p className="text-muted">Unable to load products.</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        products.map((p) => (
          <Product
            key={p.id}
            product={p}
            size={size}
          />
        ))
      )}
    </div>
  );
};

ProductListSection.propTypes = {
  products: PropTypes.array,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  size: PropTypes.number,
  skeletonCount: PropTypes.number,
};

export default ProductListSection;