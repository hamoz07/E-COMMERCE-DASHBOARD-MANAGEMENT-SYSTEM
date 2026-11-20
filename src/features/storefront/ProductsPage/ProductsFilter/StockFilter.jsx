import PropTypes from "prop-types";

const StockFilter = ({ value, onChange }) => (
  <label className="form-check d-flex align-items-center gap-2">
    <input
      className="form-check-input m-0"
      type="checkbox"
      checked={Boolean(value)}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span>In stock only</span>
  </label>
);

StockFilter.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

StockFilter.defaultProps = {
  value: false,
};

export default StockFilter;