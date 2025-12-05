import Modal from "./Modal";
const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, deleteObject }) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onCancel} title="Confirm delete">
      <p>Do you really want to delete this {deleteObject}?</p>
      <p>(Can't be undone)</p>
      <br />
      <button onClick={onConfirm}>Confirm</button>{" "}
      <button onClick={onCancel}>Cancel</button>
    </Modal>
  );
};

export default ConfirmDeleteModal;
