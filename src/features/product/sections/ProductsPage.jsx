import { useMemo } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS } from "../../../api/endpoints.js";
import useGetCategories from "../../../hooks/categories/useGetCategories.js";
import useProductSearch from "../../../hooks/products/useProductSearch.js";
import ProductListSection from "../components/ProductListSection.jsx";
import ProductsFilter from "../../storefront/ProductsPage/ProductsFilter/ProductsFilter.jsx";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIds = searchParams.getAll("category[]").length
    ? searchParams.getAll("category[]")
    : searchParams.get("category")
      ? [searchParams.get("category")]
      : [];
  const categoryId = categoryIds[0];
  const searchQuery = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page") || 1);
  const hasSearchIntent = Boolean(searchQuery || categoryIds.length);
  const { data: categories = [] } = useGetCategories();
  const searchResults = useProductSearch(searchParams, hasSearchIntent);

  const selectedCategories = useMemo(
    () =>
      categories.filter((category) =>
        categoryIds.includes(String(category.id)),
      ),
    [categories, categoryIds],
  );

  const filters = {
    category: categoryIds,
    rating: searchParams.get("rating") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    in_stock: ["1", "true"].includes(searchParams.get("in_stock")),
    sort: searchParams.get("sort") || "relevance",
  };
  const updateFilters = (nextFilters) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (key === "category") {
        nextParams.delete("category");
        nextParams.delete("category[]");
        value.forEach((category) => {
          nextParams.append("category[]", String(category));
        });
      } else if (value === "" || value === false) {
        nextParams.delete(key);
      } else if (key === "in_stock") {
        nextParams.set(key, "1");
      } else {
        nextParams.set(key, String(value));
      }
    });

    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const goToPage = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    setSearchParams(nextParams);
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">
        {selectedCategories.length > 0
          ? `${selectedCategories.map((category) => category.title).join(", ")} products`
          : searchQuery
            ? `Search results for "${searchQuery}"`
            : "All products"}
      </h1>
      <Row>
        {hasSearchIntent && (
          <Col md={3} className="mb-4">
            <ProductsFilter value={filters} onChange={updateFilters} />
          </Col>
        )}
        <Col md={hasSearchIntent ? 9 : 12}>
          <ProductListSection
            endpoint={PRODUCTS}
            queryKey="category"
            categoryId={categoryId}
            products={hasSearchIntent ? searchResults.data?.data || [] : undefined}
            isLoading={hasSearchIntent ? searchResults.isLoading : undefined}
            isError={hasSearchIntent ? searchResults.isError : undefined}
            size={6}
            skeletonCount={8}
          />
          {hasSearchIntent && searchResults.data?.last_page > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              />
              {Array.from(
                { length: searchResults.data.last_page },
                (_, index) => index + 1,
              ).map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === searchResults.data.last_page}
                onClick={() => goToPage(currentPage + 1)}
              />
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
