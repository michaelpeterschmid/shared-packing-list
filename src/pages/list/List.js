import styles from "./List.module.css";

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

//custom hook to read a document in realtime
import { useDocument } from "../../hooks/useDocument.js";

//date fns distancetonow
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

//user contect for conditional renderings
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useCollection } from "../../hooks/useCollection.js";
import { hasModifyRights } from "../../hooks/useHasModifyRights.js";

//components to add items, update or delete entire list
import Modal from "../../components/Modal.js";

import ConfirmDeleteModal from "../../components/ConfirmDeleteModal.js";
import ItemForm from "../../components/ItemForm.js";
import ListForm from "../../components/ListForm.js";
import { useFirestore } from "../../hooks/useFirestore.js";

const List = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const { document: listDoc, error: listError } = useDocument("lists", id);
  const { documents } = useCollection(`lists/${id}/items`);
  const navigate = useNavigate();

  const getOwner = () => {
    return listDoc.users.find((user) => {
      return user.accessRight === "o";
    });
  };

  const {
    updateDocument: updateList,
    deleteDocument: deleteList,
    response: listResponse,
  } = useFirestore("lists");

  //deleting a list

  const [deleteModalIsActive, setDeleteModalIsActive] = useState(false);

  const handleDeleteClick = () => {
    setDeleteModalIsActive(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalIsActive(false);
  };

  const handleConfirmDelete = async () => {
    await deleteList(id);
    navigate(`/lists/${id}`); // back to list
  };

  //updating a list
  const [modifyModalIsActive, setModifyModalIsActive] = useState(false);
  const [modifyError, setModifyError] = useState(null);
  const handleModifyClick = () => {
    setModifyModalIsActive(true);
  };
  const handleCancelModify = () => {
    setModifyModalIsActive(false);
  };
  const handleConfirmModify = async (data) => {
    await updateList(id, data);
    setModifyError(listResponse.error);
    setModifyModalIsActive(false);
  };

  //new Item handling
  const { addDocument, response: itemResponse } = useFirestore(
    `lists/${id}/items`
  );

  const canCreateItems = hasModifyRights(listDoc, user);

  const [newItemModalIsActive, setNewItemModalIsActive] = useState(false);
  const [newItemError, setNewItemError] = useState(null);

  const handleClickAddNewItem = () => {
    setNewItemModalIsActive(true);
  };

  const handleCancleAddNewItem = () => {
    setNewItemModalIsActive(false);
  };

  const handleConfirmAddNewItem = async (data) => {
    for (const item of documents) {
      if (item.title.toLowerCase().trim() === data.title.toLowerCase().trim()) {
        setNewItemError("Item with same title already exists");
        setNewItemModalIsActive(false);
        return;
      }
    }
    await addDocument(data);
    setNewItemError(itemResponse.error);
    setNewItemModalIsActive(false);
  };

  if (listError) {
    return <div className="error">{listError}</div>;
  }

  if (!listDoc || !documents) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className={styles.list}>
      <div className={styles["list-metadata"]}>
        <h4>{listDoc.title}</h4>
        <p className={styles["created-by"]}>
          Created by {getOwner()?.displayName}
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
        <p className={styles["member-paragraph"]}>Project members:</p>
        <div className={styles.members}>
          {listDoc.users.map((user) => (
            <span className={styles.members} key={user.userId}>
              {" "}
              {user.displayName}
            </span>
          ))}
        </div>

        {user.uid === getOwner()?.userId && (
          <div className={styles["owner-div"]}>
            <button onClick={handleDeleteClick}>Delete list</button>{" "}
            <button onClick={handleModifyClick}>Modify list</button>
            <ConfirmDeleteModal
              isOpen={deleteModalIsActive}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              deleteObject={
                "entire list and all items & users"
              }></ConfirmDeleteModal>
            {modifyModalIsActive && (
              <Modal title={"Update List"} onClose={handleCancelModify}>
                <ListForm
                  initialValues={listDoc}
                  onSubmit={handleConfirmModify}></ListForm>
              </Modal>
            )}
            {modifyError && <p className="error">{modifyError}</p>}
          </div>
        )}
      </div>

      <h3>List Items</h3>
      {canCreateItems && (
        <div className={styles["add-item"]}>
          <button onClick={handleClickAddNewItem}>Add new item</button>{" "}
          <br></br>
          <br></br>
          {newItemModalIsActive && (
            <Modal onClose={handleCancleAddNewItem} title={"Add new Item"}>
              <ItemForm onSubmit={handleConfirmAddNewItem}></ItemForm>
            </Modal>
          )}
          {newItemError && <p className="error">{newItemError}</p>}
        </div>
      )}
      <p>Click on item for details</p>

      {documents?.map((item) => (
        <Link to={`/lists/${id}/items/${item.id}`} key={item.id}>
          <div className={styles["item-div"]}>
            <h4>{item.title}</h4>
            <p className={styles["last-updated"]}>
              Last update by: {item.updatedBy},{" "}
              <span className="no-wrap">
                {item.updatedAt
                  ? formatDistanceToNow(item.updatedAt.toDate(), {
                      addSuffix: true,
                    })
                  : "just now"}
              </span>
            </p>
          </div>
        </Link>
      ))}

      {documents?.length === 0 && <p className="error">No items so far.</p>}

      <div className={styles.comments}> </div>
    </div>
  );
};

export default List;
