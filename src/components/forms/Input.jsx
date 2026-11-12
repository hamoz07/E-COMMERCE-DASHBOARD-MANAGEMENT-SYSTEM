import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const Input = forwardRef(
  (
    {
      label,
      name,
      register,
      type = "text",
      error,
      helperText,
      success,
      disabled = false,
      isSubmitted = false,
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
      <Form.Group className="mb-3" controlId={name}>
        {label && <Form.Label>{label}</Form.Label>}

        <Form.Control
          {...registration}
          {...inputProps}
          type={type}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          isInvalid={Boolean(showError)}
          isValid={Boolean(success) && !showError}
          ref={(element) => {
            registration.ref(element);

            if (typeof forwardedRef === "function") {
              forwardedRef(element);
            } else if (forwardedRef) {
              forwardedRef.current = element;
            }
          }}
        />

        {showError && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}

        {!showError && success && (
          <Form.Control.Feedback type="valid">
            {success}
          </Form.Control.Feedback>
        )}

        {helperText && <Form.Text muted>{helperText}</Form.Text>}
      </Form.Group>
    );
  },
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  success: PropTypes.string,
  disabled: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};

export default Input;