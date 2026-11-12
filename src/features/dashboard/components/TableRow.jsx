
import { memo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { atTypeGenerator } from "../../../utils/dategenerator";

const TableRow = memo(function TableRow({
  item,
  header,
  userName,
  isThisRowDeleting,
  onDelete,
}) {
  return (
    <tr>
      <td>{item.id}</td>

      {header.map((head) => (
        <td key={head.key}>
          {head.key === "images" ? (
            item[head.key].map((src) => (
              <img
                key={src.id}
                src={src.image}
                width={70}
                height={70}
                alt=""
                style={{
                  objectFit: "contain",
                  marginLeft: ".4rem",
                }}
              />
            ))
          ) : head.key === "image" ? (
            <img
              src={item[head.key]}
              width="100"
              alt=""
              style={{ objectFit: "contain" }}
            />
          ) : head.key === "created_at" ||
            head.key === "updated_at" ? (
            atTypeGenerator(item[head.key])
          ) : item[head.key] === "1995" ? (
            "admin"
          ) : item[head.key] === "2001" ? (
            "User"
          ) : item[head.key] === "1996" ? (
            "Writer"
          ) : item[head.key] === "1999" ? (
            "product manager"
          ) : (
            item[head.key]
          )}

          {item[head.key] === userName && " (you)"}
        </td>
      ))}

      <td>
        {isThisRowDeleting ? (
          <span className="text-muted fw-bold small animate-pulse">
            Deleting...
          </span>
        ) : (
          <>
            <Link to={`${item.id}`}>
              <FontAwesomeIcon
                icon={faPen}
                style={{
                  fontSize: "20px",
                  color: "green",
                  paddingRight: "10px",
                }}
              />
            </Link>

            {item.name !== userName && item.role !== "1995" && (
              <FontAwesomeIcon
                icon={faTrash}
                style={{
                  fontSize: "20px",
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => onDelete(item.id)}
              />
            )}
          </>
        )}
      </td>
    </tr>
  );
});

export default TableRow;
