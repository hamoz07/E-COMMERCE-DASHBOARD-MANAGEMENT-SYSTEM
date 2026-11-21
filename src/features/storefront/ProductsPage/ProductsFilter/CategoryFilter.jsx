import { useState } from "react";
import PropTypes from "prop-types";
import useGetCategories from "../../../../hooks/categories/useGetCategories.js";
import Button from "../../../../components/ui/Button/Button.jsx";

const INITIAL_CATEGORY_COUNT = 5;
const CATEGORY_INCREMENT = 5;

const CategoryFilter = ({ value, onChange }) => {
  const { data: categories = [], isLoading, isError } = useGetCategories();
  const [visibleCount, setVisibleCount] = useState(INITIAL_CATEGORY_COUNT);
  const [hasShownAll, setHasShownAll] = useState(false);
  const selectedCategories = Array.isArray(value)
    ? value.map(String)
    : value
      ? [String(value)]
      : [];
  const toggleCategory = (categoryId) => {
    const normalizedId = String(categoryId);
    const nextCategories = selectedCategories.includes(normalizedId)
      ? selectedCategories.filter((id) => id !== normalizedId)
      : [...selectedCategories, normalizedId];

    onChange(nextCategories);
  };

  const showMore = () => {
    setVisibleCount((count) => {
      const nextCount = Math.min(
        count + CATEGORY_INCREMENT,
        categories.length,
      );

      console.log(nextCount)

      if (nextCount === categories.length) {
        setHasShownAll(true);
      }

      return nextCount;
    });
  };

  const showLess = () => {
    setVisibleCount((count) => {
      const nextCount = Math.max(
        count - CATEGORY_INCREMENT,
        INITIAL_CATEGORY_COUNT,
      );

      console.log(nextCount)

      if (nextCount === INITIAL_CATEGORY_COUNT) {
        setHasShownAll(false);
      }

      return nextCount;
    });
  };

  

  if (isLoading) {
    return <p className="text-muted small mb-0">Loading categories...</p>;
  }

  if (isError) {
    return (
      <p className="text-danger small mb-0" role="alert">
        Unable to load categories.
      </p>
    );
  }

  const visibleCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = visibleCount < categories.length && !hasShownAll;

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="fs-6 fw-semibold">Category</legend>
      <label className="form-check d-flex align-items-center gap-2 mb-2" htmlFor={"all-categories"}>
        <input
          className="form-check-input m-0"
          type="radio"
          name="product-category"
          id={"all-categories"}
          value=""
          checked={selectedCategories.length === 0}
          onChange={() => onChange([])}
        />
        <span>All categories</span>
      </label>

      {visibleCategories.map((category) => (
        <label
          className="form-check d-flex align-items-center gap-2 mb-2"
          key={category.id}
          htmlFor={`category-${category.id}`}
        >
          <input
            className="form-check-input m-0"
            type="checkbox"
            name="product-category"
            id={`category-${category.id}`}
            value={category.id}
            checked={selectedCategories.includes(String(category.id))}
            onChange={() => toggleCategory(category.id)}
          />
          <span>{category.title}</span>
        </label>
      ))}

      {hasMoreCategories && (
        <Button
          variant="link"
          className="btn-sm p-0 d-flex align-items-center mx-auto"
          
          onClick={showMore}
        >
          Show more
        </Button>
      )}
      {visibleCount > INITIAL_CATEGORY_COUNT && (
        <Button
             variant="link"
          className="btn-sm p-0 d-flex align-items-center mx-auto"
          
          onClick={showLess}
        >
          Show less
        </Button>
      )}
    </fieldset>
  );
};

CategoryFilter.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  onChange: PropTypes.func.isRequired,
};

CategoryFilter.defaultProps = {
  value: [],
};

export default CategoryFilter;
