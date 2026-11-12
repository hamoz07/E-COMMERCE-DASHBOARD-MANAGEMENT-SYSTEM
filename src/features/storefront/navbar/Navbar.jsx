import { useContext } from "react";
import { Container, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/Modern Headphone Twitch Logo.png";
import Profile from "../../../assets/810-8105516_blue-person-icon-blue-person-icon-png.png";
import Cart from "../../../assets/cart.jpeg";
import { Textreplacer } from "../../../utils/TextReplacer";
import Skeleton from "../../../components/ui/Skeleton/Skeleton.jsx";
import { WINContexter } from "../../../context/WindowContext.jsx";
import useGetCategories from "../../../hooks/categories/useGetCategories.js";
const CategoryChipSkeleton = ({ count = 8 }) => {
  const widths = ["60px", "80px", "50px", "70px", "90px"];

  return Array.from({ length: count }).map((_, i) => (
    <span
      key={`cat-chip-skeleton-${i}`}
      className="category-naver mb-0 d-inline-flex align-items-center"
      style={{ padding: "0 8px" }}
    >
      <Skeleton
        width={widths[i % widths.length]}
        height="14px"
        borderRadius="4px"
      />
    </span>
  ));
};

const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  const { windowStroke } = useContext(WINContexter);
  const count = !windowStroke || windowStroke >= 968 ? 10 : 3;
  const { data: categories, isLoading: loading, isError: error } = useGetCategories();

  const isOnCategoriesPage = pathname === "/categories";

  const showAllCats = categories?.slice(0, count).map((cat) => (
    <p key={cat.id} className="category-naver mb-0">
      {Textreplacer(cat.title, 10)}
    </p>
  ));

  return (
    <div className="py-3 bg-transparent main-home-navbar">
      <Container>
        <div className="d-flex align-items-center justify-content-center flex-wrap">
          <Link to="/" className="col-3">
            <img src={Logo} alt="logo" width={100} height={100} className="nav-logo" />
          </Link>

          <div className="col-12 col-md-6 order-md-2 order-3 mt-md-0 mt-3 position-relative b-10">
            <Form.Control
              type="search"
              className="form-control custom-search py-3 b-10"
              placeholder="search product"
            />
            <h3 className="btn btn-primary position-absolute top-0 end-0 h-100 line-height m-0 px-4 d-flex align-items-center justify-content-center b-10">
              Search
            </h3>
          </div>

          <div className="col-3 d-flex align-items-center justify-content-end order-md-3 order-1">
            <Link
              to="/cart"
              state={pathname === "/cart" ? undefined : { backgroundLocation: location }}
              aria-label="View cart"
            >
              <img src={Cart} className="b-10 profile" alt="" />
            </Link>
            <Link to="/profile" aria-label="View profile">
              <img src={Profile} className="b-10 profile" alt="" />
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <div className="d-flex align-items-center justify-content-center flex-wrap">
            {loading ? (
              <CategoryChipSkeleton count={count} />
            ) : error ? (
              <span className="text-muted small">Unable to load categories.</span>
            ) : (
              <>
                {showAllCats}
                {!isOnCategoriesPage && categories?.length > 0 && (
                  <>
                    <Link
                      to="/categories"
                      className="cat-title text-underline cursor-pointer"
                    >
                      Show all
                    </Link>
                    {categories.length > count && (
                      <span className="text-muted small ms-2">
                        ({categories.length - count} more)
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
