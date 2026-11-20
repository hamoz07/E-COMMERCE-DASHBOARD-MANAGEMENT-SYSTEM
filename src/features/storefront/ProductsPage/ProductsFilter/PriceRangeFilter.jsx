import PropTypes from "prop-types";
import Button from "../../../../components/ui/Button/Button";

const PriceRangeFilter = ({ value, onChange }) => (
  <fieldset className="border-0 p-0 m-0">
    <legend className="fs-6 fw-semibold">Price range</legend>
    <div className="d-flex gap-2">
      <div>
        <label className="form-label visually-hidden" htmlFor="minimum-price">
          Minimum price
        </label>
        <input
          className="form-control"
          id="minimum-price"
          name="min_price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Min"
          value={value.min_price}
          onChange={(event) =>
            onChange({ ...value, min_price: event.target.value })
          }
        />
      </div>
      <div>
        <label className="form-label visually-hidden" htmlFor="maximum-price">
          Maximum price
        </label>
        <input
          className="form-control"
          id="maximum-price"
          name="max_price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Max"
          value={value.max_price}
          onChange={(event) =>
            onChange({ ...value, max_price: event.target.value })
          }
        />
      </div>
    </div>
  </fieldset>
);

PriceRangeFilter.propTypes = {
  value: PropTypes.shape({
    min_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onChange: PropTypes.func.isRequired,
};

PriceRangeFilter.defaultProps = {
  value: {
    min_price: "",
    max_price: "",
  },
};

export default PriceRangeFilter;