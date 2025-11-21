import React, { useEffect, useState } from "react";
import styles from "./AuthForm.module.css";

const SignupForm = () => {
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file)); //  built-in browser feature that creates a temporary URL that points to a file stored in memory.
  };

  // revoke file stored in memory using a useEffect cleanup function
  useEffect(() => {
    return () => URL.revokeObjectURL(iconPreview);
  }, [iconPreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // build FormData or send to backend / Firebase etc.
    // const formData = new FormData();
    // formData.append("icon", iconFile);
  };

  return (
    <form className={styles["auth-form"]}>
      <label>
        <span>Display name</span>
        <input type="text" required />
      </label>
      <label className={styles["upload-button"]}>
        Upload a profile picture{" "}
        {/* Clicking the label triggers the hidden <input type="file"></input> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleIconChange}
          style={{ display: "none" }}
        />
      </label>

      {iconPreview && (
        <img
          src={iconPreview}
          alt="Profile preview"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <label>
        <span>Email</span>
        <input type="email" required />
      </label>
      <label>
        <span>Password</span>
        <input type="password" required />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
};

export default SignupForm;
