import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar.jsx";

const Website = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Website;
