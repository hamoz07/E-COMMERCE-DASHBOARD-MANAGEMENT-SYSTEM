import React from "react";
import { Link } from "react-router-dom";

const Error403 = ({ role }) => {
  return (
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}
      className="d-flex flex-column align-items-center"
    >
      <p>{"can't reach this page"}</p>
      <Link
        to={role === "1996" ? "writer" : ""}
        className="d-block mt-3 text-center btn btn-danger"
        style={{ width: "fit-content"}}
      >
        Get back to Home page
      </Link>
    </div>
  );
};

export default Error403;
