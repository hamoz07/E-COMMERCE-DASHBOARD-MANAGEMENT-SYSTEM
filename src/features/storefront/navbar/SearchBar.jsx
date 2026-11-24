import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";

const SEARCH_PAGE = "/products";
const SINGLE_PRODUCT_PREFIX = "/product/";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const urlQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(urlQuery);

  const isOnSearchPage = pathname.startsWith(SEARCH_PAGE);
  const isOnSingleProduct = pathname.startsWith(SINGLE_PRODUCT_PREFIX);

  useEffect(() => {
    if (isOnSearchPage || urlQuery) {
      setInputValue(urlQuery);
    }
  }, [urlQuery, isOnSearchPage]);

  useEffect(() => {
    if (!isOnSearchPage && !isOnSingleProduct) {
      setInputValue("");
    }
  }, [isOnSearchPage, isOnSingleProduct]);

  const submitSearch = (event) => {
    event.preventDefault();
    const nextQuery = inputValue.trim();

    if(nextQuery.length < 3) {
      return;
    }

    if (isOnSearchPage) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("q", nextQuery);
      nextParams.delete("category");
      nextParams.delete("category[]");
      nextParams.delete("page");
      setSearchParams(nextParams);
      return;
    }

    if (nextQuery) {
      navigate(`/products?q=${encodeURIComponent(nextQuery)}`);
    }
  };

  return (
    <Form role="search" onSubmit={submitSearch}>
      <Form.Control
        type="search"
        className="form-control custom-search py-3 b-10"
        placeholder="Search products"
        aria-label="Search products"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <Button
        type="submit"
        className="btn btn-primary position-absolute top-0 end-0 h-100 line-height m-0 px-4 d-flex align-items-center justify-content-center b-10"
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBar;
