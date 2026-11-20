/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../api/auth.js";
import { useCurrentUser } from "../../context/currentUserContext.jsx";
import LoadingPage from "../../components/feedback/LoadingPage.jsx";

const CheckAuth = () => {
  const { currentUser, userLoading, userError } = useCurrentUser();
  const authenticated = isAuthenticated();

  if (!authenticated || userError) {
    return <Navigate to="/login" replace />;
  }

  if (userLoading || !currentUser) {
    return <LoadingPage text={"Checking authorization..."} bg="#9aa0a74d" mt="0" mh="100vh" />;
  }

  return <Outlet />;
};

export default CheckAuth;
