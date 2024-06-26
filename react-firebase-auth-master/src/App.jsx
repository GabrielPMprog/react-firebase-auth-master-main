import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import { ProtectedRoute } from "./components/protectedRoute.jsx";
import { ProtectedRouteAdmin } from "./components/ProtectedRouteAdmin.jsx";
import { ProtectedRouteAdminEdit } from "./components/ProtectedRouteAdminEdit.jsx";

import { Home } from "./pages/home";
import { Private } from "./pages/private";


import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
const admin = false

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }

      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <h2>Loading...</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home user={user}></Home>}></Route>

        <Route
          path="/dashboard"
          element={<ProtectedRouteAdmin admin={admin}></ProtectedRouteAdmin>}
        ></Route>
        <Route
          path={`/editUser/:id`}
          element={<ProtectedRouteAdminEdit admin={admin}></ProtectedRouteAdminEdit>}
        ></Route>
        <Route
          path="/private"
          element={
            <ProtectedRoute user={user}>
              <Private user={user}></Private>
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
