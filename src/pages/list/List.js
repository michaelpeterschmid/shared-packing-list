import styles from "./List.module.css";

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

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
import ItemForm from "../../components/ItemForm.js";
import { useFirestore } from "../../hooks/useFirestore.js";

const List = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const { document, error } = useDocument("lists", id);
  const { documents } = useCollection(`lists/${id}/items`);

  const getOwner = () => {
    return document.users.find((user) => {
      return user.accessRight === "o";
    });
  };

  //new Item handling
  const { addDocument, response } = useFirestore(`lists/${id}/items`);

  const canCreateItems = hasModifyRights(document, user);

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
    setNewItemError(response.error);
    setNewItemModalIsActive(false);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!document || !documents) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className={styles.list}>
      <div className={styles["list-metadata"]}>
        <h4>{document.title}</h4>
        <p className={styles["created-by"]}>
          Created by {getOwner()?.displayName}
        </p>
        <p className={styles["category"]}>Category: {document.category}</p>
        <p className={styles["last-updated"]}>
          Last updated{" "}
          {formatDistanceToNow(document.createdAt.toDate(), {
            addSuffix: true,
          })}{" "}
        </p>
        <p className={styles.description}>{document.description}</p>
        <div className={styles.members}>
          <p>Project members:</p>
          <ul>
            {document.users.map((user) => (
              <li key={user.userId}> {user.displayName}</li>
            ))}
          </ul>
          {user.uid === getOwner()?.userId && (
            <div className={styles["owner-div"]}>
              <button>Delete list</button> <button>Modify list</button>
            </div>
          )}
        </div>
      </div>

      <h3>List Items</h3>
      {canCreateItems && (
        <>
          <button onClick={handleClickAddNewItem}>Add new item</button>{" "}
          <br></br>
          <br></br>
          {newItemModalIsActive && (
            <Modal onClose={handleCancleAddNewItem} title={"Add new Item"}>
              <ItemForm onSubmit={handleConfirmAddNewItem}></ItemForm>
            </Modal>
          )}
          {newItemError && <p className="error">{newItemError}</p>}
        </>
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
