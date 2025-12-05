import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import styles from "./Listitem.module.css";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useFirestore } from "../../hooks/useFirestore.js";
import Modal from "../../components/Modal.js";

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

  const { document: listDoc, error: listError } = useDocument("lists", id);
  const navigate = useNavigate();

  

  // ---- modal state ----
  const [modalIsActive, setModalIsActive] = useState(false);

  const handleDeleteClick = () => {
    setModalIsActive(true);
  };

  const handleCancelDelete = () => {
    setModalIsActive(false);
  };

  const handleConfirmDelete = async () => {
    await deleteDocument(itemid);
    navigate(`/lists/${id}`); // back to list
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
          {formatDistanceToNow(itemDoc.updatedAt.toDate(), {
            addSuffix: true,
          })}{" "}
          by {itemDoc.updatedBy}
        </p>
      </div>

      {hasModifyRights() && (
        <>
          {!response.isPending && (
            <>
              <button>Modify</button>{" "}
              <button onClick={handleDeleteClick}>Delete</button>
            </>
          )}
          {response.error && <p className="error">{response.error}</p>}
        </>
      )}

      {modalIsActive && (
        <Modal onClose={handleCancelDelete} title="Confirm delete">
          <p>Do you really want to delete this item?</p>
          <button onClick={handleConfirmDelete} disabled={response.isPending}>
            Confirm
          </button>{" "}
          <button onClick={handleCancelDelete}>Cancel</button>
        </Modal>
      )}
    </div>
  );
};

export default ListItem;
