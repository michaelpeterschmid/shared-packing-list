import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const SignupForm = () => {
  // revoke file stored in memory using a useEffect cleanup function
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, error, isPending } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(displayName, email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span>Display name</span>
        <input
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
          type="text"
          required
        />
      </label>
      <label>
        <span>Email</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {!isPending && <button>Sign up</button>}
      {isPending && <button disabled>Loading...</button>}
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default SignupForm;
