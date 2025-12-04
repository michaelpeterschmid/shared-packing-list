import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loginWithGoogle, error, isPending } = useLogin();

  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  if (user) {
    return <Navigate to="/" replace></Navigate>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </label>
        {!isPending && <button>Login</button>}
        {isPending && <button disabled>Loading...</button>}
        {error && <p className="error">{error}</p>}
      </form>
      <br />
      {!isPending && (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      )}
    </>
  );
};

export default LoginForm;
