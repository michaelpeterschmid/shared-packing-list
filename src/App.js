import { useAuthContext } from "./hooks/useAuthContext";
import { Routes, Route } from "react-router-dom";

//components
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import List from "./pages/list/List";
import ListItem from "./pages/listItem/ListItem";
import Create from "./pages/create/Create";
import LoginForm from "./components/LoginForm";

function App() {
  const { authIsReady, user } = useAuthContext();
  return (
    <div className="App">
      {authIsReady && (
        <>
          <div className="container">
            <Navbar> </Navbar>
            <Routes>
              <Route path="/" element={user && <Dashboard></Dashboard>}></Route>
              <Route path="/lists/:id" element={user && <List></List>}></Route>
              <Route
                path="/lists/:id/items/:itemid"
                element={user && <ListItem></ListItem>}></Route>
              <Route path="/create" element={user && <Create></Create>}></Route>
            </Routes>
            {!user && (
              <p className="error">
                Please sign up or log in to use this application.
              </p>
            )}
          </div>
        </>
      )}
      {!authIsReady && <p className="loading">Loading...</p>}
    </div>
  );
}

export default App;
