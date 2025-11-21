import React from "react";
import styles from "./AuthForm.module.css";

const LoginForm = () => {
  return (
    <form className={styles["auth-form"]}>
      <label>
        <span>Email</span>
        <input type="email" required />
      </label>
      <label>
        <span>Password</span>
        <input type="password" required />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
