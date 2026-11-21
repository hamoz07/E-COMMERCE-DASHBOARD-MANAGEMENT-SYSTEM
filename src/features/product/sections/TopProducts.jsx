// TopProduct.jsx
import ProductListSectionFetcher from "../components/ProductListSectionFetcher.jsx";
import { LATEST } from "../../../api/endpoints.js";

const TopProduct = () => (
  <ProductListSectionFetcher endpoint={LATEST} queryKey="latest" size={6} skeletonCount={4} />
);

export default TopProduct;