import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const SelectInput = forwardRef(
  (
    {
      children,
      label,
      name,
      register,
      error,
      helperText,
      disabled = false,
      isSubmitted = false,
      ...selectProps
    },
    forwardedRef,
  ) => {
    const registration = register(name);
    const [touched, setTouched] = useState({ [name]: false });
    const [suppressedErrors, setSuppressedErrors] = useState({});

    const handleChange = (event) => {
      registration.onChange(event);
      selectProps.onChange?.(event);

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
      selectProps.onBlur?.(event);
    };

    const showError =
      (touched[name] || isSubmitted) &&
      error &&
      (isSubmitted || suppressedErrors[name] !== error);

    return (
      <Form.Group className="mb-3" controlId={name}>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Select
          {...registration}
          {...selectProps}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={Boolean(showError)}
          ref={(element) => {
            registration.ref(element);

            if (typeof forwardedRef === "function") {
              forwardedRef(element);
            } else if (forwardedRef) {
              forwardedRef.current = element;
            }
          }}
        >
          {children}
        </Form.Select>
        {showError && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
        {helperText && <Form.Text muted>{helperText}</Form.Text>}
      </Form.Group>
    );
  },
);

SelectInput.displayName = "SelectInput";

SelectInput.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};

export default SelectInput;
