import React, { useState } from "react";
import styles from "./Dashboard.module.css";

// custom hook
import { useFirestore } from "../../hooks/useFirestore.js";
import { useCollection } from "../../hooks/useCollection";
import { Link } from "react-router-dom";

import Modal from "../../components/Modal";
import ListForm from "../../components/ListForm";
import ListFilter from "./ListFilter.js";
import { useAuthContext } from "../../hooks/useAuthContext.js";

const Dashboard = () => {
  const { user } = useAuthContext();
  const { documents, error } = useCollection("lists", [
    "userIds",
    "array-contains",
    user.uid,
  ]);

  const typeClasses = {
    packing: styles.packing,
    todos: styles.todos,
    shopping: styles.shopping,
  };

  // adding a new list functionality
  const { addDocument: addList, response } = useFirestore("lists");
  const [listModalIsActive, SetListModalIsActive] = useState(false);
  const [newListError, setNewListError] = useState(null);
  const handleClickAddNewList = () => {
    SetListModalIsActive(true);
  };
  const handleCancelAddNewList = () => {
    SetListModalIsActive(false);
  };

  const handleSubmitAddNewList = async (data) => {
    await addList(data);
    setNewListError(response.error);
    SetListModalIsActive(false);
  };

  //filter handling
  const [currentFilter, setCurrentFilter] = useState("all");
  const changeCurrentFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  const lists = document
    ? documents?.filter((document) => {
        switch (currentFilter) {
          case "all":
            return true;
          case "owned by me":
            return document.users.some(
              (u) => u.userId === user.uid && u.accessRight === "o"
            );
          case "shopping":
          case "todos":
          case "packing":
          case "other":
            return document.category === currentFilter;
          default:
            return true;
        }
      })
    : null;

  if (!lists) return <p className="error">Loading</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <div>
        <ListFilter changeCurrentFilter={changeCurrentFilter}></ListFilter>
      </div>
      <div className={styles.newlist}>
        <button onClick={handleClickAddNewList}>Add New List</button>
        {listModalIsActive && (
          <Modal onClose={handleCancelAddNewList} title={"Add a new List"}>
            <ListForm
              initialValues={null}
              onSubmit={handleSubmitAddNewList}></ListForm>
          </Modal>
        )}
        {newListError && <p className="error">{newListError}</p>}
      </div>

      <div className={styles["list-div"]}>
        {lists.length === 0 && <p>No Lists yet!</p>}
        {lists?.map((list) => {
          const typeClass = typeClasses[list.category] || "";

          return (
            <Link key={list.id} to={`/lists/${list.id}`}>
              <div className={`${styles.list} ${typeClass}`}>
                <h4>{list.title}</h4>
                <p>category: {list.category}</p>
                <div className={styles.members}>
                  <p>members:</p>
                  <ul>
                    {list.users.map((user) => (
                      <li key={user.userId}>{user.displayName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
