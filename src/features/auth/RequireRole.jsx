/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import { useCurrentUser } from "../../context/currentUserContext.jsx";
import Error403 from "../../components/feedback/Error403.jsx";

const RequireRole = ({ roles }) => {
  const { currentUser } = useCurrentUser();

  return roles.includes(currentUser?.role) ? (
    <Outlet />
  ) : (
    <Error403 role={currentUser?.role} />
  );
};

export default RequireRole;
