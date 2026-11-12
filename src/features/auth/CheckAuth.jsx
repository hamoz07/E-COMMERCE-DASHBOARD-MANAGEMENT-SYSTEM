/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { ONEUSERREQ, baseURL } from "../../api/endpoints.js";
import LoadingPage from "../../components/feedback/LoadingPage.jsx";
import Error403 from "../../components/feedback/Error403.jsx";
// eslint-disable-next-line react/prop-types
const CheckAuth = ({ role }) => {
  const [userData, setUserData] = useState("");
  const cookie = Cookie();
  const token = cookie.get("user-token");

  const nav = useNavigate();

  useEffect(() => {
    axios
      .get(`${baseURL}/${ONEUSERREQ}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((user) => setUserData(user.data))
      .catch(() => nav("/login", { replace: true }));
  }, []);

  return token ? (
    userData === "" ? (
      <LoadingPage bg="#9aa0a74d" mt="0" mh={"100vh"} />
    ) : role.includes(userData.role) ? (
      <Outlet />
    ) : (
      <Error403 role={userData.role} />
    )
  ) : (
    <Navigate to={"/login"} replace={true} />
  );
};

export default CheckAuth;
