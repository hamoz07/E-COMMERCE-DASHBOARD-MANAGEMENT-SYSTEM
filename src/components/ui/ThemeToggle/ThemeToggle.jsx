import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../../../context/ThemeContext.jsx";
import "./theme-toggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} aria-hidden="true" />
      <span className="theme-toggle__label">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
