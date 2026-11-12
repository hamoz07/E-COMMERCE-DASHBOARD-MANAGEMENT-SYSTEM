import { Fragment, useContext, useEffect, useState } from "react";
import "./bars.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { CONACT } from "../../../context/context.jsx";
import { WINContexter } from "../../../context/WindowContext.jsx";
import { ONEUSERREQ } from "../../../api/endpoints.js";
import { AX } from "../../../api/client.js";
import { links } from "./Links";
import { useCurrentUser } from "../../../context/currentUserContext.jsx";
const SideBar = () => {
  const { open, setOpen } = useContext(CONACT);
  const { windowStroke } = useContext(WINContexter);
const { currentUser, userLoading } = useCurrentUser();
  const closeWhenSelect = () => {
    if (windowStroke < 768 && open) {
      return setOpen(false);
    }
    window.scrollTo(0, 0);
  };

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
          transition: "opacity 0.3s ease-in-out", /* Ensure no conflicting styles */
          opacity: open ? 1 : 0,
         
          zIndex: 500,
        }}
      ></div>
      <div
        className="side-bar"
        style={{
          left: windowStroke < 768 ? (open ? 0 : "-100%") : 0,
          width: open ? "300px" : "fit-content",
          position: windowStroke < 768 ? "fixed" : "",
          transition: "transform 0.5s ease", /* Ensure no conflicting styles */
          transform: open ? "translateX(0)" : "translateX(-10%)",
        }}
      >
        {open && <h6>DASHBOARD</h6>}
        {!userLoading && currentUser && links.map((link, i) => {
         if (link.role.includes(currentUser?.role)) {
            return (
              <Fragment key={i}>
                <NavLink
                  to={link.path}
                  className={`d-flex align-items-center ${
                    !open ? "justify-content-center" : ""
                  } gap-2 p-2 px-3 mb-3 side-bar-link`}
                  onClick={closeWhenSelect}
                >
                  <FontAwesomeIcon  icon={link.icon} />
                  {open && <p className="m-0">{link.text}</p>}
                </NavLink>
                {!open && (
                  <div className={`closed closed-${link.text}`}>
                    {link.text.split("-").join(" ")}
                  </div>
                )}
              </Fragment>
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
