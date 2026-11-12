// TopProduct.jsx
import ProductListSection from "../components/ProductListSection.jsx";
import { LATEST } from "../../../api/endpoints.js";

const TopProduct = () => (
  <ProductListSection endpoint={LATEST} queryKey="latest" size={6} skeletonCount={4} />
);

export default TopProduct;