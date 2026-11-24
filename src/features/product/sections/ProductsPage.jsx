import { useMemo } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS } from "../../../api/endpoints.js";
import useGetCategories from "../../../hooks/categories/useGetCategories.js";
import useProductSearch from "../../../hooks/products/useProductSearch.js";
import { useProductList } from "../../../hooks/products/useProductList.js";
import ProductListSection from "../components/ProductListSection.jsx";
import ProductsFilter from "../../storefront/ProductsPage/ProductsFilter/ProductsFilter.jsx";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- URL param parsing ---
  const categoryIds = searchParams.getAll("category[]").length
    ? searchParams.getAll("category[]")
    : searchParams.get("category")
      ? [searchParams.get("category")]
      : [];
  const categoryId = categoryIds[0];
  const searchQuery = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page") || 1);
  const hasSearchIntent = Boolean(searchQuery);

  const filters = {
    category:categoryIds,
    rating: searchParams.get("rating") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    in_stock: ["1", "true"].includes(searchParams.get("in_stock")),
    sort: searchParams.get("sort") || "relevance",
  };

  // --- Queries ---
  const { data: categories = [] } = useGetCategories();

  const searchResults = useProductSearch(searchParams, hasSearchIntent);

  const productListQuery = useProductList(PRODUCTS, "category", categoryId, {
    enabled: !hasSearchIntent && categoryIds.length > 0,
  });

  // --- Derive active query ---
  // three mutually exclusive states: search, category browse, nothing
  const activeQuery = hasSearchIntent
    ? searchResults
    : categoryIds.length > 0
      ? productListQuery
      : null;

  const displayedProducts = activeQuery?.data?.data ?? [];
  const isLoading = activeQuery?.isLoading ?? false;
  const isError = activeQuery?.isError ?? false;
  const lastPage = activeQuery?.data?.last_page ?? 1;

  // --- Derived display values ---
  const selectedCategories = useMemo(
    () =>
      categories.filter((category) =>
        categoryIds.includes(String(category.id)),
      ),
    // stringify to avoid new-array-reference on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, categoryIds.join(",")],
  );

  const pageTitle = useMemo(() => {
    if (selectedCategories.length > 0) {
      return `${selectedCategories.map((c) => c.title).join(", ")} products`;
    }
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
  }, [selectedCategories, searchQuery]);

  // --- Windowed pagination ---
  const pageNumbers = useMemo(() => {
    if (lastPage <= 1) return [];

    const delta = 2; // pages to show either side of current
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(lastPage, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // prepend first page + ellipsis if needed
    if (range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);

    // append ellipsis + last page if needed
    if (range[range.length - 1] < lastPage - 1) range.push("...");
    if (range[range.length - 1] !== lastPage) range.push(lastPage);

    return range;
  }, [currentPage, lastPage]);

  // --- Handlers ---
  const updateFilters = (nextFilters) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(nextFilters).forEach(([key, val]) => {
      if (key === "category") {
        nextParams.delete("category");
        nextParams.delete("category[]");
        val.forEach((cat) => nextParams.append("category[]", String(cat)));
      } else if (val === "" || val === false) {
        nextParams.delete(key);
      } else if (key === "in_stock") {
        nextParams.set(key, "1");
      } else {
        nextParams.set(key, String(val));
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
      <h1 className="mb-4">{pageTitle}</h1>
      <Row>
        {hasSearchIntent && (
          <Col md={3} className="mb-4">
            <ProductsFilter value={filters} onChange={updateFilters} />
          </Col>
        )}

        <Col md={hasSearchIntent ? 9 : 12}>
          <ProductListSection
            products={displayedProducts}
            isLoading={isLoading}
            isError={isError}
            size={hasSearchIntent ? 4 : 3}
            skeletonCount={8}
          />

          {hasSearchIntent && lastPage > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              />

              {pageNumbers.map((page, i) =>
                page === "..." ? (
                  <Pagination.Ellipsis key={`ellipsis-${i}`} disabled />
                ) : (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => page !== currentPage && goToPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ),
              )}

              <Pagination.Next
                disabled={currentPage === lastPage}
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