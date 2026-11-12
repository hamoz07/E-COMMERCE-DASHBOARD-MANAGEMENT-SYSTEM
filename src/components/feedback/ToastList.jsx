import { useAppSelector } from "../../store/hooks";
import ToastItem from "./ToastItem.jsx";
import "./toast.css";

const ToastList = () => {
  const records = useAppSelector((state) => state.toasts.records);

  return (
    <div className="toast-list" aria-live="polite" aria-atomic="false">
      {records.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastList;
