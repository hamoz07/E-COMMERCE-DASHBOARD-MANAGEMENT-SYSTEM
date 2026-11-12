// LatestSaleProduct.jsx
import ProductListSection from "../components/ProductListSection.jsx";
import { SALEPROD } from "../../../api/endpoints.js";

const LatestSaleProduct = () => (
  <ProductListSection endpoint={SALEPROD} queryKey="sale" size={3} skeletonCount={8} />
);

export default LatestSaleProduct;