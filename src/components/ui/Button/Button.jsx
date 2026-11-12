import { forwardRef } from "react";
import PropTypes from "prop-types";
import "./button.css";

const Button = forwardRef(
  (
    {
      children,
      as: Component = "button",
      variant = "primary",
      size = "medium",
      type = "button",
      loading = false,
      loadingText = "Loading...",
      disabled = false,
      fullWidth = false,
      iconOnly = false,
      ariaLabel,
      leftIcon,
      rightIcon,
      className = "",
      ...buttonProps
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const componentProps = {
      ...buttonProps,
      ref,
      type: Component === "button" ? type : undefined,
      disabled: Component === "button" ? isDisabled : undefined,
      "aria-label": iconOnly ? ariaLabel : buttonProps["aria-label"],
      "aria-busy": loading ? "true" : undefined,
      className: [
        "app-button",
        `app-button--${variant}`,
        `app-button--${size}`,
        fullWidth && "app-button--full-width",
        iconOnly && "app-button--icon-only",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    };

    return (
      <Component {...componentProps}>
        {loading && <span className="app-button__spinner" aria-hidden="true" />}
        {!loading && leftIcon}
        <span>{loading ? loadingText : children}</span>
        {!loading && rightIcon}
      </Component>
    );
  },
);

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "outline",
    "ghost",
    "link",
    "icon",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  loading: PropTypes.bool,
  loadingText: PropTypes.node,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  iconOnly: PropTypes.bool,
  ariaLabel: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Button;