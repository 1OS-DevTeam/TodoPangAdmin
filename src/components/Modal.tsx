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
        className="bg-white pt-30 rounded-xl shadow-lg w-[60%] min-w-[350px] max-w-[600px] relative animate-fade-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-center text-18 font-semibold tracking-tight shrink-0">
          {title}
        </h4>
        <button
          className="absolute top-8 right-20 p-20 cursor-pointer"
          onClick={onClose}
        >
          <IoClose className="text-25 text-gray-6" />
        </button>

        <div className="overflow-auto min-h-[240px] max-h-[70vh] px-30 py-30">
          {children}
        </div>

        <button
          disabled={isButtonLoading}
          className="w-full bg-blue-6 items-center text-white h-60 rounded-b-10 text-16 font-medium tracking-tight hover:bg-blue-7 flex justify-center align-middle shrink-0"
          onClick={handleClickButton}
        >
          {isButtonLoading ? (
            <AiOutlineLoading3Quarters className="h-55 text-22 animate-spin text-white" />
          ) : (
            <span>{buttonTitle}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Modal;
