import { Navigate } from "react-router-dom";

import { EditUser } from "../pages/editUser";

export const ProtectedRouteAdminEdit = ({ admin }) => {
  admin = true;
  return <EditUser />;
};
