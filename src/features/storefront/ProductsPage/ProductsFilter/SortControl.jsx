import PropTypes from "prop-types";

const SortControl = ({ value, onChange }) => (
  <div>
    <label className="form-label fw-semibold" htmlFor="product-sort">
      Sort by
    </label>
    <select
      className="form-select"
      id="product-sort"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="relevance">Relevance</option>
      <option value="title_asc">Name: A to Z</option>
      <option value="title_desc">Name: Z to A</option>
      <option value="price_asc">Price: Low to high</option>
      <option value="price_desc">Price: High to low</option>
      <option value="rating_desc">Highest rated</option>
    </select>
  </div>
);

SortControl.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

SortControl.defaultProps = {
  value: "relevance",
};

export default SortControl;