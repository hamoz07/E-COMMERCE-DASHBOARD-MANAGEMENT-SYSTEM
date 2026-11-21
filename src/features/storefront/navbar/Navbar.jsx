import { useContext } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/Modern Headphone Twitch Logo.png";
import { Textreplacer } from "../../../utils/TextReplacer";
import { WINContexter } from "../../../context/WindowContext.jsx";
import useGetCategories from "../../../hooks/categories/useGetCategories.js";
import ThemeToggle from "../../../components/ui/ThemeToggle/ThemeToggle.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { CategoryChipSkeleton } from "../../../components/skeletons/CategoryChipSkeleton.jsx";
import SearchBar from "./SearchBar.jsx";
import Image from "../../../components/ui/Image/Image.jsx";


const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  const { windowStroke } = useContext(WINContexter);
  const count = !windowStroke || windowStroke >= 968 ? 10 : 3;
  const { data: categories, isLoading: loading, isError: error } = useGetCategories();
  const isOnCategoriesPage = pathname === "/categories";

  const showAllCats = categories?.slice(0, count).map((cat) => (
    <Link
      key={cat.id}
      to={`/products?category=${cat.id}`}
      className="category-naver mb-0 text-decoration-none"
    >
      {Textreplacer(cat.title, 10)}
    </Link>
  ));


  return (
    <div className="py-3 bg-transparent main-home-navbar">
      <Container>
        <div className="d-flex align-items-center justify-content-center flex-wrap">
          <Link to="/" className="col-3">
            <Image
              src={Logo}
              alt="Store logo"
              width={100}
              height={100}
              className="nav-logo"
              objectFit="contain"
            />
          </Link>

          <div className="col-12 col-md-6 order-md-2 order-3 mt-md-0 mt-3 position-relative b-10">
           <SearchBar />
          </div>

          <div className="col-3 d-flex align-items-center justify-content-end order-md-3 order-1 gap-2">
            <ThemeToggle />
            <Link
              to="/cart"
              state={pathname === "/cart" ? undefined : { backgroundLocation: location }}
              aria-label="View cart"
            >
      <FontAwesomeIcon icon={faCartShopping} className="fs-4"  />
            </Link>
            <Link to="/profile" aria-label="View profile">

                    <FontAwesomeIcon icon={faUser} className="fs-4" />
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
