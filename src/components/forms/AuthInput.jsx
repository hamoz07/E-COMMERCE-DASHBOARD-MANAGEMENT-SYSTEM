import { forwardRef, useState } from "react";
import PropTypes from "prop-types";

const AuthInput = forwardRef(
  (
    {
      id,
      label,
      name,
      register,
      error,
      isSubmitted = false,
      type = "text",
      ...inputProps
    },
    forwardedRef,
  ) => {
    const registration = register(name);
    const [touched, setTouched] = useState({ [name]: false });
    const [suppressedErrors, setSuppressedErrors] = useState({});

    const handleChange = (event) => {
      registration.onChange(event);
      inputProps.onChange?.(event);

      if (touched[name]) {
        setSuppressedErrors((currentErrors) => ({
          ...currentErrors,
          [name]: error || "",
        }));
      }
    };

    const handleBlur = (event) => {
      setTouched((currentTouched) => ({
        ...currentTouched,
        [name]: true,
      }));
      setSuppressedErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
      registration.onBlur(event);
      inputProps.onBlur?.(event);
    };
    const showError =
      (touched[name] || isSubmitted) &&
      error &&
      (isSubmitted || suppressedErrors[name] !== error);

    return (
      <div className="input-desc mb-3">
        <input
          {...registration}
          {...inputProps}
          id={id || name}
          type={type}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={(element) => {
            registration.ref(element);

            if (typeof forwardedRef === "function") {
              forwardedRef(element);
            } else if (forwardedRef) {
              forwardedRef.current = element;
            }
          }}
        />

        {showError && <span className="error">{error}</span>}
        <label htmlFor={id || name}>{label}</label>
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";

AuthInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  error: PropTypes.string,
  isSubmitted: PropTypes.bool,
  type: PropTypes.string,
};

export default AuthInput;