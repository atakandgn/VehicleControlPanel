import React, { useEffect, useRef } from "react";

const ConfirmationModal = ({ title, text, isOpen, onClose, onConfirm }) => {
  const modalRef = useRef();

  const handleClose = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out backdrop-blur-sm bg-black bg-opacity-50`}>
      <div
        ref={modalRef}
        className={`flex flex-col gap-4 relative border border-tertiary bg-primary rounded-lg p-8 shadow-lg w-full max-w-md mx-4 md:mx-auto transform transition-transform duration-500 ease-in-out ${isOpen ? 'scale-100' : 'scale-95'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-300 text-3xl w-12 h-12"
        >
          &times;
        </button>
        <h2 className="text-gray-100 text-2xl font-bold">
          {title ? title : "Confirmation"}
        </h2>
        <p className="text-gray-400">
          {text ? text : "Are you sure you want to proceed?"}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
