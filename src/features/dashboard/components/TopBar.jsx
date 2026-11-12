import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { CONACT } from "../../../context/context.jsx";
import axios from "axios";
import { LogoutReq, baseURL } from "../../../api/endpoints.js";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../../../context/currentUserContext.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const TopBar = () => {
  const { setOpen } = useContext(CONACT);
  const [name, setName] = useState("");
  const nav = useNavigate();
  const cookie = Cookie();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const token = cookie.get("user-token");
const { currentUser, userLoading, userError, clearCurrentUser } = useCurrentUser();

useEffect(() => {
  if (!userLoading && (userError || !currentUser)) {
    nav("/login", { replace: true });
  }else{
    setName(currentUser?.name || "");
  }
}, [userLoading, userError, currentUser, nav]);

  async function logout() {
    try {
      const res = await axios.get(`${baseURL}/${LogoutReq}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res;
      queryClient.removeQueries({ queryKey: ["cartItems"] });
      clearCurrentUser(); 
      cookie.remove("user-token");
      dispatch(
        addToast({
          title: "Signed out",
          type: "success",
          message: "You have been signed out successfully.",
        }),
      );
      location.reload();
    } catch (error) {
      dispatch(
        addToast({
          title: "Unable to sign out",
          type: "danger",
          message: "Please try again.",
        }),
      );
    }
  }

  return (
    <div className="top-bar d-flex align-items-center justify-content-between shadow-sm">
      <div className="d-flex gap-5 align-items-center ">
        <h3 className="m-0">E-COMMERCE</h3>
        <FontAwesomeIcon
          cursor={"pointer"}
          onClick={() => setOpen((prev) => !prev)}
          icon={faBars}
        />
      </div>
      <DropdownButton title={name}>
        <Dropdown.Item onClick={logout}>logout</Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

export default TopBar;
