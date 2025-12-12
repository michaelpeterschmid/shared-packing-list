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
import ListItemsSection from "./ListItemsSection.js";
import ListComments from "./ListComments.js";

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

  // leave list
  const [leaveModalIsActive, setLeaveModalIsActive] = useState(false);
  const [leaveError, setLeaveError] = useState(null);
  const handleLeaveClick = () => setLeaveModalIsActive(true);
  const handleCancleLeave = () => setLeaveModalIsActive(false);
  const handleConfirmLeave = async () => {
    setLeaveError(null);
    //remove the all entries where userId = user.uid
    let { modifyUserIds, userIds, users } = listDoc;

    modifyUserIds = (modifyUserIds || []).filter((id) => id !== user.uid);
    userIds = (userIds || []).filter((id) => id !== user.uid);
    //just to keep UI in sync
    users = (users || []).filter((u) => u.userId !== user.uid);

    const success = await updateList(
      id,
      { modifyUserIds, userIds, users },
      true
    );
    if (!success) {
      setLeaveError(listResponse.error);
      setLeaveModalIsActive(false);
      return;
    }
    setLeaveModalIsActive(false);
    navigate("/"); // back to dashboard
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
      <div className={styles["list-details"]}>
        <div className={styles["list-metadata"]}>
          <h4>{listDoc.title}</h4>
          <p className={styles["created-by"]}>
            Created by {owner?.userId === user.uid ? "YOU" : owner?.displayName}
          </p>
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
          <p className={styles["member-paragraph"]}>
            List read access members:
          </p>
          <div className={styles.members}>
            {listDoc.users.some((u) => u.accessRight === "r")
              ? listDoc.users
                  .filter((u) => u.accessRight === "r")
                  .map((u) => (
                    <div key={u.userId}>
                      {u.displayName}
                      {u.userId === user.uid ? " (you)" : ""}
                    </div>
                  ))
              : "None"}
          </div>
          <p className={styles["member-paragraph"]}>
            List write access members:
          </p>
          <div className={styles.members}>
            {listDoc.users
              .filter((u) => u.accessRight !== "r")
              .map((u) => (
                <div key={u.userId}>
                  {u.displayName}
                  {u.userId === user.uid ? " (you)" : ""}
                </div>
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
          {user.uid !== owner?.userId && (
            <div className={styles["member-div"]}>
              <button onClick={handleLeaveClick}>Leave list</button>
              {leaveModalIsActive && (
                <Modal title={"Leave list"} onClose={handleCancleLeave}>
                  <p>Do you really want to leave this list?</p>
                  <p>
                    (If you want to rejoin later, the list-owner has to readd
                    you)
                  </p>
                  <br />
                  <button onClick={handleConfirmLeave}>Confirm</button>{" "}
                  <button onClick={handleCancleLeave}>Cancel</button>
                </Modal>
              )}
            </div>
          )}
        </div>

        {/* --- Items-Bereich ausgelagert --- */}
        <ListItemsSection listId={id} listDoc={listDoc} />
      </div>
      <div className={styles.comments}>
        <ListComments listId={id}></ListComments>
      </div>
    </div>
  );
};

export default List;
