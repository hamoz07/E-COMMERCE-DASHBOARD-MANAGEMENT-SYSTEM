// components/ProductListSectionFetcher.jsx
// Self-fetching wrapper — used by home page sections only
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
import { useProductList } from "../../../hooks/products/useProductList.js";
import ProductListSection from "./ProductListSection.jsx";

const ProductListSectionFetcher = ({ endpoint, queryKey, size = 6, skeletonCount = 4 }) => {
  const { data: products = [], isLoading, isError } = useProductList(endpoint, queryKey);

  return (
    <Container className="mt-3 pb-4">
      <ProductListSection
        products={products}
        isLoading={isLoading}
        isError={isError}
        size={size}
        skeletonCount={skeletonCount}
      />
    </Container>
  );
};

ProductListSectionFetcher.propTypes = {
  endpoint: PropTypes.string.isRequired,
  queryKey: PropTypes.string.isRequired,
  size: PropTypes.number,
  skeletonCount: PropTypes.number,
};

export default ProductListSectionFetcher;