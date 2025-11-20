import React, { useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  return (
    <nav>
      {/* if user is not logged in */}

      {!user && (
        <ul className={"no-bullets"}>
          <li>ListMate</li>
          <li>Login</li>
          <li>Signup</li>
        </ul>
      )}
      {/* if user is logged in  */}
      {user && (
      <ul className={"no-bullets"}>
        <li>ListMate</li>
        <li>Profile</li>
        <li>Logout</li>
      </ul>
      )}

    </nav>
  );
};

export default Navbar;
