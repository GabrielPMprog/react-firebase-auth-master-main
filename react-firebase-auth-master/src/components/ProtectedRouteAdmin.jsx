import { Navigate } from "react-router-dom";

import { Dashboard } from "../pages/Dashboard";

export const ProtectedRouteAdmin = ({admin}) => {
  return admin ? (
    <Dashboard  />
  ) : (
    <Navigate to="/"></Navigate>
  );
};
