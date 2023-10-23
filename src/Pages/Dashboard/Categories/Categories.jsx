/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { CAT, CATADD, ONECAT, ONEUSERREQ } from "../../../Api/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AX } from "../../../Api/AxiosShortCut";
import LoadingPage from "../../loading";
import { CONACT } from "../../../Context/conetxt";
import { WINContexter } from "../../../Context/WindowContext";
import Changable from "../../../components/Dashboard/Changable";

const Categories = () => {
  const { open } = useContext(CONACT);
  const { windowStroke } = useContext(WINContexter);
  const [categories, setCategories] = useState([]);
  const [checkItems, setCheckItems] = useState(false);
  const [re, setRe] = useState(0);

  const head = [
    { key: "title", name: "Title" },
    { key: "image", name: "image" },
  ];

  useEffect(() => {
    async function runcats() {
      const res = await AX.get(`/${CAT}`).then((res) => {
        setCategories(res.data);
        setCheckItems(categories.length === 0 ? true : false);
      });
    }
    runcats();
  }, [re]);

  async function deleteUser(id) {
    try {
      let res = await AX.delete(`/${ONECAT}/${id}`);
      setRe(re + 1);
    } 
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="p-2 w-100 mx-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h2>Categories</h2>
        <Link
          className="btn btn-primary fw-bold d-flex align-items-center gap-2"
          to={"/dashboard/category/create"}
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Category
        </Link>
      </div>
      {categories.length === 0 && !checkItems ? (
        <LoadingPage
          bg={open && windowStroke < 768 ? "transparent" : "#F7F8FA"}
          mt="130px"
          mh={"60vh"}
        />
      ) : categories.length === 0 && checkItems ? (
        <span className="error-noitems">no categories found</span>
      ) : (
        <Changable
          header={head}
          data={categories}
          delUser={deleteUser}
          showDelButton={true}
        />
      )}
    </div>
  );
};

export default Categories;
