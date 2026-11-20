import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Textreplacer } from "../../../utils/TextReplacer";
import useGetCategories from "../../../hooks/categories/useGetCategories.js";
import { CategoryCardSkeleton } from "../../../components/skeletons/CategoryCardSkeleton.jsx";


const CategoriesPage = () => {
  const { data: categories = [], isLoading, isError } = useGetCategories();
  
  const showingThem = categories?.map((c) => (
    <div className="col-lg-2 col-md-6 col-12 bg-transparent border-0" key={c.id} id={c.id}>
      <Link
        className="m-1 app-surface border d-flex align-items-center justify-content-start gap-3 rounded p-2 h-100 text-decoration-none"
        to={`/products?category=${c.id}`}
      >
        <img
          src={c.image}
          alt={c.title}
          width={50}
          className="rounded"
          loading="lazy"
          decoding="async"
        />
        <p className="m-0">{Textreplacer(c.title, 12)}</p>
      </Link>
    </div>
  ));

  return (
    <>
      <div className="py-5">
        <Container>
          <div className="d-flex align-items-stretch justify-content-center flex-wrap row gap-2">
            {isLoading ? (
              <CategoryCardSkeleton count={6} />
            ) : isError ? (
              <p className="text-muted">Unable to load categories.</p>
            ) : (
              showingThem
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default CategoriesPage;