import styles from "./List.module.css";

import React from "react";
import { Link, useParams } from "react-router-dom";

//custom hook to read a document in realtime
import { useDocument } from "../../hooks/useDocument.js";

//date fns distancetonow
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

//user contect for conditional renderings
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useCollection } from "../../hooks/useCollection.js";

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

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!document) {
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

      {documents?.map((item) => (
        <Link to={`/lists/${id}/items/${item.id}`} key={item.id}>
          <div className={styles["item-div"]}>
            <h4>{item.title}</h4>
            <p className={styles["last-updated"]}>
              Last update by: {item.updatedBy},{" "}
              {formatDistanceToNow(item.updatedAt.toDate(), {
                addSuffix: true,
              })}{" "}
            </p>
          </div>
        </Link>
      ))}

      <div className={styles.comments}></div>
    </div>
  );
};

export default List;
