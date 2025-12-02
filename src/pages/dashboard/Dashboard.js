import React from "react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <div>Filter</div>
      <div className={styles["list-div"]}>
        <div className={[styles.list, styles.holiday].join(" ")}>
          <h4>Griechenland Ferien</h4>
          <p>Category: packing-list</p>
          <div className={styles.members}>
            <p>members:</p>
            <ul>
              <li>Michael</li>
              <li>Gabriel</li>
              <li>Peter</li>
              <li>Therese</li>
              <li>Joanna</li>
            </ul>
          </div>
        </div>
        <div className={[styles.list, styles.shopping].join(" ")}>
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
        <div className={[styles.list, styles.todos].join(" ")}>
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
