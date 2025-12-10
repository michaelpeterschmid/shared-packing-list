// ListItemsSection.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./List.module.css";

import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useFirestore } from "../../hooks/useFirestore.js";
import { hasModifyRights } from "../../hooks/useHasModifyRights.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import Modal from "../../components/Modal.js";
import ItemForm from "../../components/ItemForm.js";

const ListItemsSection = ({ listId, listDoc }) => {
  const { user } = useAuthContext();

  // Items laden
  const { documents: items, error: itemsError } = useCollection(
    `lists/${listId}/items`
  );

  // Firestore-Hook für Items
  const { addDocument, response: itemResponse } = useFirestore(
    `lists/${listId}/items`
  );

  const canCreateItems = hasModifyRights(listDoc, user);

  // Modal-State für neues Item
  const [newItemModalIsActive, setNewItemModalIsActive] = useState(false);
  const [newItemError, setNewItemError] = useState(null);

  const handleClickAddNewItem = () => {
    setNewItemError(null);
    setNewItemModalIsActive(true);
  };

  const handleCancelAddNewItem = () => {
    setNewItemModalIsActive(false);
  };

  const handleConfirmAddNewItem = async (data) => {
    if (items) {
      for (const item of items) {
        if (
          item.title.toLowerCase().trim() === data.title.toLowerCase().trim()
        ) {
          setNewItemError("Item with same title already exists");
          setNewItemModalIsActive(false);
          return;
        }
      }
    }

    await addDocument(data);
    setNewItemError(itemResponse.error);
    setNewItemModalIsActive(false);
  };

  if (itemsError) {
    return <p className="error">{itemsError}</p>;
  }

  if (!items) {
    return <p className="loading">Loading items...</p>;
  }

  return (
    <div>
      <h3>List Items</h3>

      {canCreateItems && (
        <div className={styles["add-item"]}>
          <button onClick={handleClickAddNewItem}>Add new item</button>
          <br />
          <br />
          {newItemModalIsActive && (
            <Modal onClose={handleCancelAddNewItem} title="Add new Item">
              <ItemForm onSubmit={handleConfirmAddNewItem} />
            </Modal>
          )}
          {newItemError && <p className="error">{newItemError}</p>}
        </div>
      )}

      <p>Click on item for details</p>

      {items.map((item) => (
        <Link to={`/lists/${listId}/items/${item.id}`} key={item.id}>
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

      {items.length === 0 && <p className="error">No items so far.</p>}
    </div>
  );
};

export default ListItemsSection;
