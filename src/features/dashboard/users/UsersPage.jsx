/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ONEUSERREQ, USERSREQ } from "../../../api/endpoints.js";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { AX } from "../../../api/client.js";
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
import { CONACT } from "../../../context/context.jsx";
import { WINContexter } from "../../../context/WindowContext";
import Table from "../components/Table.jsx";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { table_columns } from "../components/tableColumns.js";
import { useCurrentUser } from "../../../context/currentUserContext";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const Users = () => {
  const dispatch = useAppDispatch();
  const { open } = useContext(CONACT);
  const { windowStroke } = useContext(WINContexter);
  const [users, setUsers] = useState([]);
  const [myLimit, setMyLimit] = useState(5);
  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [userLoading, setUserLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [checkItems, setCheckItems] = useState(false);
const { currentUser } = useCurrentUser();
  async function deleteUser(id) {
    try {
    await AX.delete(`/${ONEUSERREQ}/${id}`);
    
    // Filter out the deleted user immediately from local state
    setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
    setTotal((prevTotal) => prevTotal - 1);
    dispatch(
      addToast({
        title: "User deleted",
        type: "success",
        message: "The user was deleted successfully.",
      }),
    );
  } catch (err) {
    const errorMsg = axiosErrorHandler(err) || "something wrong happened";
    dispatch(
      addToast({
        title: "Unable to delete user",
        type: "danger",
        message: errorMsg,
      }),
    );
  }
  }


  useEffect(() => {
    const controller = new AbortController();
    const runProds = async () => {
      setUserLoading(true);
      try {
        const res = await AX.get(
          `/${USERSREQ}?limit=${myLimit}&page=${myCurrentPage}`,
          { signal: controller.signal }
        );
        const data = res.data;
        setUsers(data.data || []);
        setTotal(data.total || 0);
        setCheckItems(data.length === 0);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to fetch products:", err);
          throw new Error(axiosErrorHandler(err) || "something wrong happened");
        }
      } finally {
        setUserLoading(false);
      }
    };

    runProds();

    return () => controller.abort();
  }, [myLimit,myCurrentPage]);
  return (
    <div className="p-2 w-100 mx-2">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Users</h2>
        <Link
          className="btn btn-primary fw-bold d-flex align-items-center gap-2 shadow-lg "
          to={"/dashboard/user/create"}
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Create user
        </Link>
      </div>
      {users.length === 0  && !checkItems ? (
        <LoadingPage

          mt="130px"
          mh={"60vh"}
        />
      ) : users.length === 0 && checkItems ? (
        <span className="error-noitems">no users found</span>
      ) : (
        <Table
          header={table_columns["users"]}
          data={users}
          currentUser={currentUser}
          delUser={deleteUser}
          limit={myLimit}
          page={myCurrentPage}
          setMyCurrentPage={setMyCurrentPage}
          setLimit={setMyLimit}
          loading={userLoading}
          total={total}
          searchLink={ONEUSERREQ}
          foundType="users"
        />
      )}
    </div>
  );
};

export default Users;
