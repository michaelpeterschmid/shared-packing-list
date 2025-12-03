import React from "react";
import styles from "./Dashboard.module.css";

// custom hook
import { useCollection } from "../../hooks/useCollection";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { documents, error } = useCollection("lists");

  const typeClasses = {
    packing: styles.packing,
    todos: styles.todos,
    shopping: styles.shopping,
  };

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <div>Filter</div>

      <div className={styles["list-div"]}>
        {documents?.map((list) => {
          const typeClass = typeClasses[list.category] || "";
          
          return (
            <Link key={list.id} to={`/lists/${list.id}`} >
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

        {/* static examples */}
        <div className={`${styles.list} ${styles.shopping}`}>
          <h4>Einkäufe Familie Schmid</h4>
          <p>Category: shopping-list</p>
          <div className={styles.members}>
            <p>Members:</p>
            <ul>
              <li>Michael</li>
              <li>Gabriel</li>
              <li>Peter</li>
              <li>Therese</li>
              <li>Joanna</li>
            </ul>
          </div>
        </div>

        <div className={`${styles.list} ${styles.todo}`}>
          <h4>Griechenland Ferien</h4>
          <p>Category: packing-list</p>
          <div className={styles.members}>
            <p>Members:</p>
            <ul>
              <li>Michael</li>
              <li>Gabriel</li>
              <li>Peter</li>
              <li>Therese</li>
              <li>Joanna</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
