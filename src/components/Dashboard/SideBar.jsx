import { useContext, useEffect, useState } from "react";
import "./bars.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { CONACT } from "../../Context/conetxt";
import { WINContexter } from "../../Context/WindowContext";
import { ONEUSERREQ } from "../../Api/api";
import { AX } from "../../Api/AxiosShortCut";
import { links } from "./Links";
const SideBar = () => {
  const { open , setOpen } = useContext(CONACT);
  const { windowStroke } = useContext(WINContexter);
  
  const [userData, setUserData] = useState("");

  useEffect(() => {
    AX.get(`/${ONEUSERREQ}`).then((user) => setUserData(user.data));
  }, []);

  

  const closeWhenSelect = () => {
    if(windowStroke < 768 && open){
      return setOpen(false)
    }
    window.scrollTo(0,0)
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          background: "rgba(0,0,0,0.4)",
          width: "100%",
          top: "70px",
          minHeight: "100vh",
          left: 0,
          display: windowStroke < 768 && open ? "block" : "none",
        }}
      ></div>
      <div
        className="side-bar"
        style={{
          left: windowStroke < 768 ? (open ? 0 : "-100%") : 0,
          width: open ? "300px" : "fit-content",
          position: windowStroke < 768 ? "fixed" : "sticky",
        }}
      >
        {open && <h6>DASHBOARD</h6>}
        {links.map((link, i) => {
          if (link.role.includes(userData.role)) {
            return (
              <NavLink
                key={i}
                to={link.path}
                className={`d-flex align-items-center ${
                  !open ? "justify-content-center" : ""
                } gap-2 p-2 px-3 mb-3 side-bar-link`}
                onClick={closeWhenSelect}
              >
                <FontAwesomeIcon icon={link.icon} />
                {open && <p className="m-0"> {link.text}</p>}
              </NavLink>
            );
          } else {
            return null;
          }
        })}
      </div>
    </>
  );
};

export default SideBar;
