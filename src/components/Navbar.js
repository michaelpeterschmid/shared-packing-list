import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Home from "../assets/home.svg";

import Modal from "./Modal"; // adjust path to where you put Modal
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Link } from "react-router-dom";

//hooks
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout(); // custom hook for logout

  const handleLogout = async () => {
    await logout();
  };

  const [authMode, setAuthMode] = useState(null); // null, 'login', 'signup'
  const openLogin = () => setAuthMode("login");
  const openSignup = () => setAuthMode("signup");
  const closeModal = () => setAuthMode(null);

  return (
    <>
      <nav className={styles.navbar}>
        {/* if user is not logged in */}
        {!user && (
          <ul>
            <li className={styles.title}>
              <Link to="./" replace>
                <img src={Home} alt="icon" /> ListMates{" "}
              </Link>
            </li>
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
            <li className={styles.title}>
              <Link to="./" replace>
                <img src={Home} alt="icon" /> ListMates{" "}
              </Link>
            </li>

            <li>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>

      {authMode && !user && (
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
