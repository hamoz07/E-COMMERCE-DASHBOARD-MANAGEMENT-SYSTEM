// LatestSaleProduct.jsx
import { SALEPROD } from "../../../api/endpoints.js";
import ProductListSectionFetcher from "../components/ProductListSectionFetcher.jsx";

const LatestSaleProduct = () => (
  <ProductListSectionFetcher endpoint={SALEPROD} queryKey="sale" size={3} skeletonCount={8} />
);

export default LatestSaleProduct;