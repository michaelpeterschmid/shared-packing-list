import React, { useEffect, useState } from "react";

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
    <form>
      <label>
        <span>Display name</span>
        <input type="text" required />
      </label>
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
