import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button/Button.jsx";
import { baseURL, ONEUSERREQ } from "../../api/endpoints.js";
import Cookie from "cookie-universal";
import LoadingPage from "./LoadingPage.jsx";

const Error404 = () => {
  const [userData, setUserData] = useState("");
  const [navPlace, setNavPlace] = useState("");
  const cookie = Cookie();
  const token = cookie.get("user-token");

  useEffect(() => {
    axios
      .get(`${baseURL}/${ONEUSERREQ}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((user) => setUserData(user.data))
      .catch((err) => console.log(err));
    if (userData.role === "1995") {
      setNavPlace("/dashboard/users");
    } else if (userData.role === "1999") {
      setNavPlace("/dashboard/categories");
    } else {
      setNavPlace("");
    }
  }, [userData]);

  return (
    userData === "" ? (
      <LoadingPage bg="#9aa0a74d" mt="0" mh={"100vh"} />) :
    <main className="error-page">
      <div className="my-container my-h-100">
        <div className="eyes">
          <div className="eye">
            <div className="eye__pupil eye__pupil--left"></div>
          </div>
          <div className="eye">
            <div className="eye__pupil eye__pupil--right"></div>
          </div>
        </div>

        <div className="error-page__heading">
          <h1 className="error-page__heading-title">
            {"Looks like you're lost"}
          </h1>
          <p className="error-page__heading-desciption">404 error</p>
          <p className="error-page__heading-small-desciption">
            {"this page doesn't exist !"}
          </p>
        </div>

        <Button
          as={Link}
          className="error-page__button"
          variant="ghost"
          size="large"
          to={`${navPlace}`}
          aria-label={`back to ${
            navPlace === ""
              ? "home"
              : navPlace === "/dashboard/users"
              ? "users' DATA"
              : "categories' DATA"
          }`}
          title={`back to ${
            navPlace === ""
              ? "home"
              : navPlace === "/dashboard/users"
              ? "users' DATA"
              : "categories' DATA"
          }`}
        >
          back to{" "}
          {navPlace === ""
            ? "home"
            : navPlace === "/dashboard/users"
            ? "users' DATA"
            : "categories' DATA"}
        </Button>
      </div>
    </main>
  );
};

export default Error404;
