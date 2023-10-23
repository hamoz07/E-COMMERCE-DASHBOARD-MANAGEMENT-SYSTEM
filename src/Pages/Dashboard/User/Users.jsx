/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ONEUSERREQ, USERSREQ } from "../../../Api/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { AX } from "../../../Api/AxiosShortCut";
import LoadingPage from "../../loading";
import { CONACT } from "../../../Context/conetxt";
import { WINContexter } from "../../../Context/WindowContext";
import Changable from "../../../components/Dashboard/Changable";

const Users = () => {
  const { open } = useContext(CONACT);
  const { windowStroke } = useContext(WINContexter);
  const [signedinuser, setSignedinUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [re, setRe] = useState(0);

  const head = 
  [
    {key:"name",name:"Name"},
    {key:"email",name:"Email"},
    {key:"role",name:"Role"},
  ]

  async function deleteUser(id) {
    try {
      let res = await AX.delete(`/${ONEUSERREQ}/${id}`);
      setRe(re + 1);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const res = AX.get(`/${ONEUSERREQ}`).then((res) =>
      setSignedinUser(res.data)
    );
  }, []);

  useEffect(() => {
    const res = AX.get(`/${USERSREQ}`)
      .then((res) => setUsers(res.data))  
      .catch((err) => {
        console.log(err);
      });
  }, [re]);

  

  return (
    <div className="p-2 w-100 mx-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h2>Users</h2>
        <Link
          className="btn btn-primary fw-bold d-flex align-items-center gap-2"
          to={"/dashboard/user/create"}
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Create user
        </Link>
      </div>
      {users.length === 0 ? (
         <LoadingPage 
           bg={open && windowStroke < 768 ? "transparent" : "#F7F8FA"} 
           mt="130px" 
           mh={"60vh"} 
        /> 
       ) : ( 
        <Changable header={head} data={users} currentUser={signedinuser} delUser={deleteUser}/>
      )} 
    </div>  
  );
};

export default Users;
