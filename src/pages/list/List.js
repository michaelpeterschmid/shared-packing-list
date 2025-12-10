// List.js
import styles from "./List.module.css";

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDocument } from "../../hooks/useDocument.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useFirestore } from "../../hooks/useFirestore.js";

import Modal from "../../components/Modal.js";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal.js";
import ListForm from "../../components/ListForm.js";
import ListItemsSection from "./ListItemsSection.js"; // NEU

const List = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const { document: listDoc, error: listError } = useDocument("lists", id);

  const {
    updateDocument: updateList,
    deleteDocument: deleteList,
    response: listResponse,
  } = useFirestore("lists");

  const getOwner = () => {
    return listDoc?.users?.find((u) => u.accessRight === "o");
  };

  // delete list
  const [deleteModalIsActive, setDeleteModalIsActive] = useState(false);

  const handleDeleteClick = () => setDeleteModalIsActive(true);
  const handleCancelDelete = () => setDeleteModalIsActive(false);
  const handleConfirmDelete = async () => {
    await deleteList(id);
    navigate("/");
  };

  // modify list
  const [modifyModalIsActive, setModifyModalIsActive] = useState(false);
  const [modifyError, setModifyError] = useState(null);

  const handleModifyClick = () => setModifyModalIsActive(true);
  const handleCancelModify = () => setModifyModalIsActive(false);
  const handleConfirmModify = async (data) => {
    await updateList(id, data);
    setModifyError(listResponse.error);
    setModifyModalIsActive(false);
  };

  if (listError) {
    return <div className="error">{listError}</div>;
  }

  if (!listDoc) {
    return <p className="loading">Loading...</p>;
  }

  const owner = getOwner();

  return (
    <div className={styles.list}>
      <div className={styles["list-metadata"]}>
        <h4>{listDoc.title}</h4>
        <p className={styles["created-by"]}>Created by {owner?.displayName}</p>
        <p className={styles["category"]}>Category: {listDoc.category}</p>
        <p className={styles["last-updated"]}>
          Last updated{" "}
          {listDoc.updatedAt
            ? formatDistanceToNow(listDoc.updatedAt.toDate(), {
                addSuffix: true,
              })
            : "just now"}{" "}
        </p>
        <p className={styles.description}>{listDoc.description}</p>
        <p className={styles["member-paragraph"]}>Project members:</p>
        <div className={styles.members}>
          {listDoc.users.map((u) => (
            <span className={styles.members} key={u.userId}>
              {u.displayName}
            </span>
          ))}
        </div>
        {user.uid === owner?.userId && (
          <div className={styles["owner-div"]}>
            <button onClick={handleDeleteClick}>Delete list</button>{" "}
            <button onClick={handleModifyClick}>Modify list</button>
            <ConfirmDeleteModal
              isOpen={deleteModalIsActive}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              deleteObject="entire list and all items & users"
            />
            {modifyModalIsActive && (
              <Modal title="Update List" onClose={handleCancelModify}>
                <ListForm
                  initialValues={listDoc}
                  onSubmit={handleConfirmModify}
                />
              </Modal>
            )}
            {modifyError && <p className="error">{modifyError}</p>}
          </div>
        )}
      </div>

      {/* --- Items-Bereich ausgelagert --- */}
      <ListItemsSection listId={id} listDoc={listDoc} />

      <div className={styles.comments}></div>
    </div>
  );
};

export default List;
