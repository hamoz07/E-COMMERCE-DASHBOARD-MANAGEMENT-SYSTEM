/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import {
  CAT,
  CATADD,
  ONECAT,
  ONEUSERREQ,
  PROD,
  PRODUCTS,
} from "../../../Api/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AX } from "../../../Api/AxiosShortCut";
import LoadingPage from "../../loading";
import { CONACT } from "../../../Context/conetxt";
import { WINContexter } from "../../../Context/WindowContext";
import Changable from "../../../components/Dashboard/Changable";

const Products = () => {
  const { open } = useContext(CONACT);
  const { windowStroke } = useContext(WINContexter);
  const [products, setProducts] = useState([]);
  const [checkItems, setCheckItems] = useState(false);
  const [re, setRe] = useState(0);

  const head = [
    {
      key: "title",
      name: "Title",
    },
    {
      key: "description",
      name: "description",
    },
    {
      key: "price",
      name: "price",
    },
    {
      key: "rating",
      name: "rating",
    },
  ];

  useEffect(() => {
    async function runProds() {
      const res = await AX.get(`/${PRODUCTS}`).then((res) => {
        setProducts(res.data);
        setCheckItems(products.length === 0 ? true : false);
      });
    }
    runProds();
  }, [re]);

  

  async function deleteUser(id) {
    try {
      let res = await AX.delete(`/${PROD}/${id}`);
      setRe(re + 1);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="p-2 w-100 mx-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h2>Products</h2>
        <Link
          className="btn btn-primary fw-bold d-flex align-items-center gap-2"
          to={"/dashboard/product/create"}
        >
          <FontAwesomeIcon icon={faPlus} />
          Create product
        </Link>
      </div>
      {products.length === 0 && !checkItems ? (
        <LoadingPage
          bg={open && windowStroke < 768 ? "transparent" : "#F7F8FA"}
          mt="130px"
          mh={"60vh"}
        />
      ) : products.length === 0 && checkItems ? (
        <span className="error-noitems">no products found</span>
      ) : (
        <Changable
          header={head}
          data={products}
          delUser={deleteUser}
          showDelButton={true}
        />
      )}
    </div>
  );
};

export default Products;
