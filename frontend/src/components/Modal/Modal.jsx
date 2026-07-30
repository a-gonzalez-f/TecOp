import { useEffect, useState } from "react";
import "./Modal.css";
import { icons } from "../../assets/icons/Icons";

function Modal({ isOpen, onClose, children }) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!show) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "open" : "close"}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${isOpen ? "open" : "close"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button
          id="closeModalBtn"
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal"
        >
          {icons.close}
        </button>
      </div>
    </div>
  );
}

export default Modal;
