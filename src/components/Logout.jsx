import axios from "axios";
import { baseURL, LogoutReq } from "../api/endpoints.js";
import Cookie from "cookie-universal";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Button from "./ui/Button/Button.jsx";
import { useAppDispatch } from "../store/hooks";
import { addToast } from "../store/toasts/toastSlice";

const Logout = () => {
  const cookie = Cookie();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const token = cookie.get("user-token");
  async function logout() {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/${LogoutReq}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res;
      queryClient.removeQueries({ queryKey: ["cartItems"] });
      queryClient.removeQueries({ queryKey: ["authUser"] });
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
    } finally {
      setLoading(false);
    }
  }
  return token ? (
    <Button
      type="button"
      loading={loading}
      loadingText="logout"
      onClick={logout}
    >
      logout
    </Button>
  ) : "";
};

export default Logout;
