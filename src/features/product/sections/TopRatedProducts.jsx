// TopRatedProduct.jsx
import ProductListSection from "../components/ProductListSection.jsx";
import { TOPRATED } from "../../../api/endpoints.js";

const TopRatedProduct = () => (
  <ProductListSection endpoint={TOPRATED} queryKey="top-rated" size={6} skeletonCount={4} />
);

export default TopRatedProduct;