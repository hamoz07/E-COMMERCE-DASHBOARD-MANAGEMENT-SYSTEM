import PropTypes from "prop-types";

const RatingFilter = ({ value, onChange }) => (
  <div>
    <label className="form-label fw-semibold" htmlFor="product-rating">
      Minimum rating
    </label>
    <select
      className="form-select"
      id="product-rating"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Any rating</option>
      <option value="5">5 stars</option>
      <option value="4">4 stars & up</option>
      <option value="3">3 stars & up</option>
      <option value="2">2 stars & up</option>
      <option value="1">1 star & up</option>
    </select>
  </div>
);

RatingFilter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

RatingFilter.defaultProps = {
  value: "",
};

export default RatingFilter;