import { lazy, Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const ImageGallery = lazy(() => import("react-image-gallery"));
import {
  faPlusSquare,
  faMinusSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SingleProductPage.css";
import { StarRating } from "../../components/ui/StarRating/StarRating.jsx";
import { Field } from "../../components/skeletons/FieldSkeleton.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import useAddToCart from "../../hooks/cart/useAddToCart.js";
import useGetCategories from "../../hooks/categories/useGetCategories.js";

const SingleProduct = () => {
  // route anfs storing
  const { id } = useParams();
  // handlers
  const {
    count,
    cartError,
    product,
    productLoading: myLoading,
    productError,
    availableToAdd,
    isDisabled,
    isAdding,
    addCartHandler,
    increment,
    decrement,
  } = useAddToCart(id);
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategories();

  const prodcategory = useMemo(
    () =>
      categories.find(
        (category) => String(category.id) === String(product?.category),
      ),
    [categories, product?.category],
  );

  const images = useMemo(
    () =>
      Array.isArray(product?.images)
        ? product?.images.map((img) => ({
            original: img.image,
            originalAlt: product?.title ?? "Product image",
            thumbnailAlt: product?.title ?? "Product image",
            thumbnail: img.image,
            originalWidth: 800,
            originalHeight: 600,
            sizes: "(max-width: 600px) 100vw, 800px",
            loading: "lazy",
          }))
        : [],
    [product?.images, product?.title],
  );

   const isOnSale = useMemo(() => {
    return Number(product?.discount) > 0 && Number(product?.price) > 0;
  }, [product?.discount, product?.price]);

  if (productError) {
    return (
      <main className="single-product">
        <p role="alert">Unable to load this product?.</p>
      </main>
    );
  }

 

  return (
    <>
      <main className="single-product">
        <nav className="single-product__breadcrumb" aria-label="Breadcrumb">
         
          <Field loading={myLoading || categoriesLoading} width="100px" height="14px">
            <span>Home / <Link to={`/products?category=${prodcategory?.id}`}><span className="text-decoration-underline">{prodcategory?.title ?? "Category"}</span></Link> / </span>{" "}
            <strong>{product?.title ?? "Sample Product Title"}</strong>
          </Field>
        </nav>

        <section className="single-product__content">
          <Field width="100%" height="539px" loading={myLoading}>
            <div className="single-product__media">
              {isOnSale && (
                <span className="single-product__sale">Sale!</span>
              )}
              {images.length ? (
                <Suspense
                  fallback={
                    <div
                      className="single-product__empty-media"
                      role="status"
                      aria-live="polite"
                    >
                      Loading product images...
                    </div>
                  }
                >
                  <ImageGallery items={images} showPlayButton={false} />
                </Suspense>
              ) : (
                <div className="single-product__empty-media">
                  No product images
                </div>
              )}
            </div>
          </Field>

          <article className="single-product__details">
            <Field loading={myLoading} width="100%" height="30px">
              <h1>{product?.title ?? "Sample Product Title"}</h1>
            </Field>

            <Field loading={myLoading} width="100px" height="20px">
              <div
                className="single-product__rating"
                aria-label={`${product?.rating} out of 5 stars`}
              >
                <StarRating rating={product?.rating ?? 3} />
                <span className="single-product__reviews">
                  (3 customer reviews)
                </span>
                <span className={`single-product__info-dot ${availableToAdd <= 3 && "text-danger-emphasis text-opacity-10 border-danger border-opacity-75"}`}>
                  i
                </span>
                <span className={`single-product__stock ${availableToAdd <= 3 && "text-danger-emphasis text-opacity-10"}`}>
                  {availableToAdd < 1
                    ? " - Out of Stock"
                    : availableToAdd <= 3
                      ? ` - ${availableToAdd} only remaining in stock`
                      : " - In Stock"}
                </span>
              </div>
            </Field>

            <Field loading={myLoading} width="100%" height="20px">
              <div className="single-product__price">
                <strong>${product?.discount ?? product?.price}</strong>
                {product?.price &&
                  product?.discount &&
                  product?.discount !== product?.price && (
                    <del>${product?.price}</del>
                  )}
              </div>
            </Field>

            <Field loading={myLoading} width="100%" height="20px">
              <p className="single-product__description">
                {product?.description ??
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id felis sed sapien laoreet aliquet."}
              </p>
            </Field>
            <dl className="single-product__meta">
              <div>
                <dt>Category:</dt>
                <Field loading={myLoading || categoriesLoading} width="100px" height="20px">
                  <dd>{prodcategory?.title ?? "uncategorized"}</dd>
                </Field>
              </div>
            </dl>
          
            {availableToAdd > 0 && (
            <div className="single-product__actions">
              <div className="single-product__quantity" aria-label="Quantity">
                <Button
                  type="button"
                  variant="icon"
                  size="small"
                  iconOnly
                  ariaLabel="Decrease quantity"
                  className={`${count <= 1 && "opacity-50"}`}
                  onClick={decrement}
                  disabled={count <= 1}
                >
                  <FontAwesomeIcon icon={faMinusSquare} />
                </Button>
                <span>{count}</span>
                <Button
                  type="button"
                  variant="icon"
                  size="small"
                  iconOnly
                  className={`${!product || (count >= availableToAdd && "opacity-50")}`}
                  aria-label={
                    !product || count >= availableToAdd
                    ? "Cannot increase quantity, out of stock"
                      : "Increase quantity"
                  }
                  title={
                    !product || count >= availableToAdd
                      ? "Cannot increase quantity, out of stock"
                      : "Increase quantity"
                  }
                  onClick={increment}
                  disabled={!product || count >= availableToAdd}
                >
                  <FontAwesomeIcon icon={faPlusSquare} />
                </Button>
              </div>

              <Button
                className="single-product__cart"
                onClick={addCartHandler}
                disabled={isDisabled}
                loading={isAdding}
                loadingText="Adding..."
              >
                {availableToAdd === null
                  ? "Loading..."
                  : availableToAdd < 1
                    ? "Out of Stock"
                    : "Add to Cart"}
              </Button>
            </div>
                )}
            {cartError && (
              <p className="single-product__cart-error" role="alert">
                {cartError}
              </p>
            )}
          </article>
        </section>
      </main>
    </>
  );
};

export default SingleProduct;
