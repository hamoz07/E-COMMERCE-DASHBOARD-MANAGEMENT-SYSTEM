import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AX } from "../../../api/client.js";
import { CAT } from "../../../api/endpoints.js";
import { Textreplacer } from "../../../utils/TextReplacer";
import Skeleton from "../../../components/ui/Skeleton/Skeleton.jsx";
import useGetCategories from "../../../hooks/categories/useGetCategories.js";

const CategoryCardSkeleton = ({ count = 6 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div className="col-lg-2 col-md-6 col-12 bg-transparent border-0" key={`cat-card-skeleton-${i}`}>
      <div className="m-1 app-surface border d-flex align-items-center justify-content-start gap-3 rounded p-2 h-100">
        <Skeleton width="50px" height="50px" borderRadius="0.375rem" />
        <Skeleton width="60%" height="16px" borderRadius="4px" />
      </div>
    </div>
  ));
};

const CategoriesPage = () => {
  const {data: categories,loading,error} = useGetCategories();
  
  const showingThem = categories?.map((c) => (
    <div className="col-lg-2 col-md-6 col-12 bg-transparent border-0" key={c.id} id={c.id}>
      <div className="m-1 app-surface border d-flex align-items-center justify-content-start gap-3 rounded p-2 h-100">
        <img src={c.image} alt={c.title} width={50} className="rounded" />
        <p className="m-0">{Textreplacer(c.title, 12)}</p>
      </div>
    </div>
  ));

  return (
    <>
      <div className="py-5">
        <Container>
          <div className="d-flex align-items-stretch justify-content-center flex-wrap row gap-2">
            {loading && <CategoryCardSkeleton count={6} />}
            {showingThem}
          </div>
        </Container>
      </div>
    </>
  );
};

export default CategoriesPage;