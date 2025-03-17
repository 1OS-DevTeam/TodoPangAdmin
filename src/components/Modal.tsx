import React from "react";
import { IoClose } from "@react-icons/all-files/io5/IoClose";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  buttonTitle: string;
  handleClickButton: () => void;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  buttonTitle,
  handleClickButton,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-[500px] relative animate-fade-in px-30 py-40"
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
          className="w-full bg-blue-6 text-white mt-40 py-16 rounded-lg text-16 font-medium tracking-tight hover:bg-blue-7"
          onClick={handleClickButton}
        >
          {buttonTitle}
        </button>
      </div>
    </div>
  );
};

export default Modal;
