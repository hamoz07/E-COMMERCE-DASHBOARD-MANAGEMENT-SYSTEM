import axios from "axios";
import { baseURL, LogoutReq } from "../Api/api";
import Cookie from "cookie-universal";

const Logout = () => {
  const cookie = Cookie();
  const token = cookie.get("user-token");
  async function logout() {
    try {
      const res = await axios.get(`${baseURL}/${LogoutReq}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res;
      location.reload();
      cookie.remove("user-token");
    } catch (error) {
      error;
    }
  }
  return token ? <button onClick={logout}>logout</button> : "";
};

export default Logout;
