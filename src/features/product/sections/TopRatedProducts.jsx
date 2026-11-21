import ProductListSectionFetcher from "../components/ProductListSectionFetcher.jsx";
import { TOPRATED } from "../../../api/endpoints.js";

const TopRatedProduct = () => (
  <ProductListSectionFetcher endpoint={TOPRATED} queryKey="top-rated" size={6} skeletonCount={4} />
);

export default TopRatedProduct;