import { Container } from "react-bootstrap";
import Product from "./ProductCard.jsx";
import ProductCardSkeleton from "../../../components/skeletons/ProductCardSkeleton.jsx";
import { useProductList } from "../../../hooks/products/useProductList.js";

const ProductListSection = ({
  endpoint,
  queryKey,
  categoryId,
  products,
  isLoading: externalIsLoading,
  isError: externalIsError,
  size = 6,
  skeletonCount = 4,
}) => {
  const hasExternalResults = Array.isArray(products);
  const productListQuery = useProductList(
    endpoint,
    queryKey,
    categoryId,
    { enabled: !hasExternalResults },
  );
  const displayedProducts = hasExternalResults
    ? products
    : productListQuery.data || [];
  const isLoading = hasExternalResults
    ? externalIsLoading
    : productListQuery.isLoading;
  const isError = hasExternalResults
    ? externalIsError
    : productListQuery.isError;

  const skeletonCards = Array.from({ length: skeletonCount }, (_, i) => (
    <ProductCardSkeleton key={i} size={size} />
  ));

  return (
    <Container className="mt-3 pb-4">
      <div className="row g-3">
        {isLoading ? (
          skeletonCards
        ) : isError ? (
          <p className="text-muted">Unable to load products.</p>
        ) : displayedProducts.length === 0 ? (
          <p className="text-muted">No products found.</p>
        ) : (
          displayedProducts.map((p) => (
            <Product
              key={p.id}
              id={p.id}
              product={p}
              title={p.title}
              desc={p.description}
              price={p.price}
              rating={p.rating}
              ratings_number={p.ratings_number}
              img={p.images?.[0]?.image}
              discount={p.discount}
              sale={Number(p.discount) > 0 && Number(p.price) > 0}
              size={size}
            />
          ))
        )}
      </div>
    </Container>
  );
};

export default ProductListSection;