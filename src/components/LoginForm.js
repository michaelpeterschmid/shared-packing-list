import React from "react";

const LoginForm = () => {
  return (
    <form>
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
