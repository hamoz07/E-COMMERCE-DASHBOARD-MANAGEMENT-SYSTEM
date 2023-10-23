import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { CONACT } from "../../Context/conetxt";
import axios from "axios";
import { LogoutReq, ONEUSERREQ, baseURL } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { Dropdown, DropdownButton } from "react-bootstrap";

const TopBar = () => {
  const { setOpen } = useContext(CONACT);
  const [name, setName] = useState("");
  const nav = useNavigate();
  const cookie = Cookie();
  const token = cookie.get("user-token");

  useEffect(() => {
    axios
      .get(`${baseURL}/${ONEUSERREQ}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((user) => setName(user.data.name))
      .catch(() => nav("/login", { replace: true }));
  }, []);

  async function logout() {
    try {
      const res = await axios.get(`${baseURL}/${LogoutReq}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res;
      cookie.remove("user-token");
      location.reload();
    } catch (error) {
      error;
    }
  }

  return (
    <div className="top-bar d-flex align-items-center justify-content-between">
      <div className="d-flex gap-5 align-items-center">
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
