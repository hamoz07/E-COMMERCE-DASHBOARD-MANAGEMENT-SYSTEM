import PropTypes from "prop-types";
import CategoryFilter from "./CategoryFilter.jsx";
import PriceRangeFilter from "./PriceRangeFilter.jsx";
import RatingFilter from "./RatingFilter.jsx";
import SortControl from "./SortControl.jsx";
import StockFilter from "./StockFilter.jsx";

const DEFAULT_FILTERS = {
  category: [],
  rating: "",
  min_price: "",
  max_price: "",
  in_stock: false,
  sort: "relevance",
};

const ProductsFilter = ({ value = DEFAULT_FILTERS, onChange }) => {
  const updateFilter = (key, nextValue) => {
    onChange({
      ...DEFAULT_FILTERS,
      ...value,
      [key]: nextValue,
    });
  };

  return (
    <aside aria-label="Product filters" className="d-flex flex-column gap-4">
      <CategoryFilter
        value={value.category}
        onChange={(nextValue) => updateFilter("category", nextValue)}
      />
      <RatingFilter
        value={value.rating}
        onChange={(nextValue) => updateFilter("rating", nextValue)}
      />
      <PriceRangeFilter
        value={{
          min_price: value.min_price,
          max_price: value.max_price,
        }}
        onChange={(nextValue) => onChange({ ...value, ...nextValue })}
      />
      <StockFilter
        value={value.in_stock}
        onChange={(nextValue) => updateFilter("in_stock", nextValue)}
      />
      <SortControl
        value={value.sort}
        onChange={(nextValue) => updateFilter("sort", nextValue)}
      />
    </aside>
  );
};

ProductsFilter.propTypes = {
  value: PropTypes.shape({
    category: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    in_stock: PropTypes.bool,
    sort: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

ProductsFilter.defaultProps = {
  value: DEFAULT_FILTERS,
};

export default ProductsFilter;
