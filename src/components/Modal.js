import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ title, children, onClose }) => {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <header className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <h2>✕</h2>
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
