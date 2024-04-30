import { Navigate } from "react-router-dom";

import { Dashboard } from "../pages/Dashboard";

export const ProtectedRouteAdmin = ({}) => {
  return admin ? (
    <Dashboard setAdmin={setAdmin}  />
  ) : (
    <Navigate to="/"></Navigate>
  );
};
