import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Modal from "./Modal"; // adjust path to where you put Modal
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // "login" | "signup" | null

  const handleLogout = () => {
    setUser(null);
  };

  const openLogin = () => setAuthMode("login");
  const openSignup = () => setAuthMode("signup");
  const closeModal = () => setAuthMode(null);

  const handleFakeLogin = (e) => {
    e.preventDefault();
    // later: replace with Firebase auth
    setUser({ name: "Michael" });
    closeModal();
  };

  return (
    <>
      <nav className={styles.navbar}>
        {/* if user is not logged in */}
        {!user && (
          <ul>
            <li className={styles.title}>ListMate</li>
            <li>
              <button type="button" onClick={openLogin}>
                Login
              </button>
            </li>
            <li>
              <button type="button" onClick={openSignup}>
                Signup
              </button>
            </li>
          </ul>
        )}

        {/* if user is logged in  */}
        {user && (
          <ul>
            <li className={styles.title}>ListMate</li>
            <li>Profile</li>
            <li>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>

      {/* Auth modal */}
      {authMode && (
        <Modal
          title={authMode === "login" ? "Login" : "Create an account"}
          onClose={closeModal}>
          {/* children is the form element*/}
          {authMode === "login" && <LoginForm></LoginForm>}
          {authMode === "signup" && <SignupForm></SignupForm>}
        </Modal>
      )}
    </>
  );
};

export default Navbar;
