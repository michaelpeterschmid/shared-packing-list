import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; //global styles
import "./variables.css"; // global style variables

import App from "./App";

//import AuthContextProvider
import { AuthContextProvider } from "./context/AuthContext";
// importing BrowserRouter to enable routing in the application
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </Router>
  </React.StrictMode>
);
