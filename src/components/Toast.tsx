import { useEffect, useState } from "react";
import { useAppStore } from "src/stores";
import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
import { MdCancel } from "@react-icons/all-files/md/MdCancel";
import { MdError } from "@react-icons/all-files/md/MdError";

const typeStyles = {
  success: "bg-green-1 text-green-8 border-green-4",
  error: "bg-red-1 text-red-8 border-red-4",
  warn: "bg-yellow-1 text-yellow-8 border-yellow-4",
  info: "bg-blue-1 text-blue-8 border-blue-4",
};

const iconStyles = {
  success: <FaCheckCircle className="text-16 mr-6" />,
  error: <MdCancel className="text-18 mr-6" />,
  warn: <MdError className="text-18 mr-6" />,
  info: <MdError className="text-18 mr-6" />,
};

const Toast = () => {
  const { toastState, setToastState } = useAppStore();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (toastState.isOpen) {
      setIsVisible(true);

      const fadeOutTimer = setTimeout(() => setIsVisible(false), 2100);
      const closeTimer = setTimeout(() => {
        setToastState({
          ...toastState,
          isOpen: false,
        });
      }, 2600);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [toastState.isOpen, setToastState]);

  if (!toastState.isOpen) return null;

  return (
    <div className="fixed top-16 right-16 z-50">
      <div
        className={`
          w-[300px] border-l-6 px-18 py-20 rounded shadow transition-all duration-500 ease-in-out transform
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
          ${typeStyles[toastState.type as keyof typeof typeStyles] || typeStyles.success}
          `}
      >
        <div className="flex items-center mb-8">
          {toastState.title &&
            (iconStyles[toastState.type as keyof typeof iconStyles] ||
              typeStyles.success)}
          {toastState.title && (
            <strong className="block font-semibold text-16 tracking-tight">
              {toastState.title}
            </strong>
          )}
        </div>
        <p className="text-15">{toastState.message}</p>
      </div>
    </div>
  );
};

export default Toast;
