import { Container } from "react-bootstrap";
import Product from "./ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useProductList } from "../../../hooks/products/useProductList.js";

const ProductListSection = ({ endpoint, queryKey, size = 6, skeletonCount = 4 }) => {
  const { data: products = [], isLoading, isError } = useProductList(endpoint, queryKey);

  const skeletonCards = Array.from({ length: skeletonCount }, (_, i) => (
    <ProductCardSkeleton key={i} size={size} />
  ));

  return (
    <Container className="mt-3 pb-4">
      <div className="d-flex align-items-start justify-content-center flex-wrap gap-2">
        {isLoading ? (
          skeletonCards
        ) : isError ? (
          <p className="text-muted">Unable to load products.</p>
        ) : (
          products.map((p) => (
            <Product
              key={p.id}
              id={p.id}
              title={p.title}
              desc={p.description}
              price={p.price}
              rating={p.rating}
              ratings_number={p.ratings_number}
              img={p.images?.[0]?.image}
              discount={p.discount}
              sale
              size={size}
            />
          ))
        )}
      </div>
    </Container>
  );
};

export default ProductListSection;