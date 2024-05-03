

import { EditUser } from "../pages/editUser";

export const ProtectedRouteAdminEdit = ({ admin }) => {
admin = true
  return admin ? (
    <EditUser  />
  ) : (
    <Navigate to="/"></Navigate>
  );
};
