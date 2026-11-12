import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAppDispatch } from "../../store/hooks";
import { removeToast, stopDelayAppearance } from "../../store/toasts/toastSlice";

const TOAST_DURATION = 4000;

const ToastItem = ({
  id,
  title,
  message,
  type = "info",
  delayAppearance = false,
  onCloseToast,
}) => {
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const closeToast = useCallback(() => {
    dispatch(removeToast(id));
    onCloseToast?.();
  }, [dispatch, id, onCloseToast]);

  useEffect(() => {
    if (delayAppearance) {
      const delayId = setTimeout(
        () => dispatch(stopDelayAppearance(id)),
        1000,
      );
      return () => clearTimeout(delayId);
    }

    if (isPaused) return undefined;

    const intervalId = setInterval(() => {
      setProgress((current) => Math.min(current + 1, 100));
    }, TOAST_DURATION / 100);

    return () => clearInterval(intervalId);
  }, [delayAppearance, dispatch, id, isPaused]);

  useEffect(() => {
    if (progress >= 100) closeToast();
  }, [closeToast, progress]);

  if (delayAppearance) return null;

  return (
    <div
      className={`toast-item toast-item--${type}`}
      role="status"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="toast-item__content">
        <strong>{title || type}</strong>
        <p>{message}</p>
      </div>
      <button
        type="button"
        className="toast-item__close"
        aria-label="Close notification"
        onClick={closeToast}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <span
        className="toast-item__progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default ToastItem;

ToastItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
  delayAppearance: PropTypes.bool,
  onCloseToast: PropTypes.func,
};
