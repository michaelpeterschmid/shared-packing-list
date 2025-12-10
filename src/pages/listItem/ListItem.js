import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument.js";
import { hasModifyRights } from "../../hooks/useHasModifyRights.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import styles from "./Listitem.module.css";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useFirestore } from "../../hooks/useFirestore.js";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal.js";
import Modal from "../../components/Modal.js";
import ItemForm from "../../components/ItemForm.js";
import { useCollection } from "../../hooks/useCollection.js";

const ListItem = () => {
  const { user } = useAuthContext();
  const { id, itemid } = useParams();

  const { document: itemDoc, error: itemError } = useDocument(
    `lists/${id}/items`,
    itemid
  );

  const { deleteDocument, updateDocument, response } = useFirestore(
    `lists/${id}/items`
  );
  const { documents: listItems } = useCollection(`lists/${id}/items`);

  const { document: listDoc } = useDocument("lists", id);
  const navigate = useNavigate();

  const canModify = hasModifyRights(listDoc, user);

  // ---- modal state ----
  const [deleteModalIsActive, setDeleteModalIsActive] = useState(false);
  const [modifyModalIsActive, setModifyModalIsActive] = useState(false);
  const [modifyError, setModifyError] = useState(null);

  const handleDeleteClick = () => {
    setDeleteModalIsActive(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalIsActive(false);
  };

  const handleConfirmDelete = async () => {
    await deleteDocument(itemid);
    navigate(`/lists/${id}`); // back to list
  };

  const handleModifyClick = () => {
    setModifyModalIsActive(true);
  };

  const handleCancelModify = () => {
    setModifyModalIsActive(false);
  };
  const handleConfirmModify = async (data) => {
    for (const item of listItems) {
      if (
        item.title.toLowerCase().trim() === data.title.toLowerCase().trim() &&
        item.id !== itemid
      ) {
        setModifyError("An item with that title already exists.");
        setModifyModalIsActive(false);
        return;
      }
    }
    await updateDocument(itemid, data);
    setModifyError(response.error);
    setModifyModalIsActive(false);
  };

  if (itemError) {
    return <p className="error">{itemError}</p>;
  }
  if (!itemDoc) {
    return <p className="loading"></p>;
  }

  return (
    <div className={styles["item-details"]}>
      <div>
        <h4>{itemDoc.title}</h4>

        <h5>Description</h5>
        <p>
          {itemDoc.description !== "" ? itemDoc.description : "no description"}
        </p>

        <h5>Last updated</h5>
        <p>
          {itemDoc.updatedAt?.toDate
            ? formatDistanceToNow(itemDoc.updatedAt.toDate(), {
                addSuffix: true,
              })
            : "just now"}{" "}
          by {user.uid === itemDoc.userId ? "YOU" : itemDoc.updatedBy}
        </p>
      </div>

      {canModify && (
        <>
          {!response.isPending && (
            <>
              <button onClick={handleModifyClick}>Modify</button>{" "}
              <button onClick={handleDeleteClick}>Delete</button>
            </>
          )}
          {modifyError && <p className="error">{modifyError}</p>}
        </>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalIsActive}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        deleteObject={"item"}></ConfirmDeleteModal>
      {modifyModalIsActive && (
        <Modal title="Update Item" onClose={handleCancelModify}>
          <ItemForm
            initialValues={itemDoc}
            onSubmit={handleConfirmModify}></ItemForm>
        </Modal>
      )}
    </div>
  );
};

export default ListItem;
