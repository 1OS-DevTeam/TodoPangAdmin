import React, { useEffect } from "react";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  buttonTitle: string;
  isButtonLoading?: boolean;
  handleClickButton: () => void;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  buttonTitle,
  isButtonLoading,
  handleClickButton,
}: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-h-[720px] overflow-auto shadow-lg w-[60%] min-w-[350px] max-w-[600px] relative animate-fade-in px-30 py-40"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="mb-40 text-center text-22 font-semibold tracking-tight">
          {title}
        </h4>
        <button
          className="absolute top-20 right-20 p-20 cursor-pointer"
          onClick={onClose}
        >
          <IoClose className="text-25 text-gray-6" />
        </button>
        <div>{children}</div>
        <button
          disabled={isButtonLoading}
          className="w-full bg-blue-6 items-center text-white mt-40 h-55 rounded-lg text-16 font-medium tracking-tight hover:bg-blue-7 flex justify-center align-middle"
          onClick={handleClickButton}
        >
          {isButtonLoading ? (
            <AiOutlineLoading3Quarters className="h-55 text-22 animate-spin text-white" />
          ) : (
            <span className="">{buttonTitle}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Modal;
