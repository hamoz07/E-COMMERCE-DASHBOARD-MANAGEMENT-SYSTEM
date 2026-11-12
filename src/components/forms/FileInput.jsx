import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const FileInput = forwardRef(
  (
    {
      label,
      name,
      register,
      error,
      helperText,
      disabled = false,
      onChange,
      ...inputProps
    },
    forwardedRef,
  ) => {
    const registration = register ? register(name) : null;

    const handleChange = (event) => {
      registration?.onChange(event);
      onChange?.(event);
    };

    return (
      <Form.Group className="mb-3" controlId={name}>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          {...registration}
          {...inputProps}
          type="file"
          disabled={disabled}
          onChange={handleChange}
          isInvalid={Boolean(error)}
          ref={(element) => {
            registration?.ref(element);

            if (typeof forwardedRef === "function") {
              forwardedRef(element);
            } else if (forwardedRef) {
              forwardedRef.current = element;
            }
          }}
        />
        {error && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
        {helperText && <Form.Text muted>{helperText}</Form.Text>}
      </Form.Group>
    );
  },
);

FileInput.displayName = "FileInput";

FileInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default FileInput;
