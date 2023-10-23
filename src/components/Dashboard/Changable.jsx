/* eslint-disable react/prop-types */
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const Changable = ({ header, data, currentUser, delUser, showDelButton }) => {
  // default values
  const userState = currentUser || {name:""};
  // head
  const headItems = header.map((item, i) => <th key={i}>{item.name}</th>);

  // del func

  //body
  const datamapped = data.map((item, i) => (
    <tr key={i}>
      <td>{i + 1}</td>
      {header.map((head, index) => (
        <td key={index}>
          {item[head.key] === "1995" ? (
            "admin"
          ) : item[head.key] === "2001" ? (
            "User"
          ) : item[head.key] === "1996" ? (
            "Writer"
          ) : item[head.key] === "1999" ? (
            "product manager"
          ) : head.key === ("image") ? (
            <img width={"100px"} style={{objectFit:"contain"}} src={item[head.key]} />
          ) : (
            item[head.key]
          )}

          {userState && item[head.key] === userState.name && " (you)"}
        </td>
      ))}
      <td>
        <Link to={`${item.id}`}>
          <FontAwesomeIcon
            icon={faPen}
            cursor={"pointer"}
            style={{
              fontSize: "20px",
              color: "green",
              paddingRight: "10px",
            }}
          />
        </Link>
        {userState && item.name !== userState.name && item.role !== "1995" && (
          <>
            <FontAwesomeIcon
              icon={faTrash}
              style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
              onClick={() => delUser(item.id)}
            />
          </>
        )}
        
      </td>
    </tr>
  ));

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>id</th>
          {headItems}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{datamapped}</tbody>
    </Table>
  );
};

export default Changable;
