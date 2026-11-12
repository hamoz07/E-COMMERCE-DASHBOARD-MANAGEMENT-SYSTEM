import { useContext, useEffect, useState } from "react";

import {
  PROD,
  PRODUCTS,
} from "../../../api/endpoints.js";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { AX } from "../../../api/client.js";

import LoadingPage from "../../../components/feedback/LoadingPage.jsx";

import { CONACT } from "../../../context/context.jsx";

import { WINContexter } from "../../../context/WindowContext";

import Table from "../components/Table.jsx";
import { table_columns } from "../components/tableColumns.js";

import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const Products = () => {
  const dispatch = useAppDispatch();
  const { open } = useContext(CONACT);

  const { windowStroke } = useContext(WINContexter);

  const [products, setProducts] = useState([]);

  const [checkItems, setCheckItems] = useState(false);

  const [myLimit, setMyLimit] = useState(5);

  const [myCurrentPage, setMyCurrentPage] = useState(1);

  const [prodLoading, setProdLoading] = useState(false);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const runProds = async () => {
      setProdLoading(true);

      try {
        const res = await AX.get(
          `/${PRODUCTS}?limit=${myLimit}&page=${myCurrentPage}`,

          { signal: controller.signal },
        );

        const data = res.data;

        setProducts(data.data || []);

        setTotal(data.total || 0);

        setCheckItems(data.length === 0);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to fetch products:", err);

          throw new Error(axiosErrorHandler(err) || "something wrong happened");
        }

      } finally {
        setProdLoading(false);
      }
    };

    runProds();

    return () => controller.abort();
  }, [myLimit, myCurrentPage]);



  async function deleteUser(id) {
    try {
      await AX.delete(`/${PROD}/${id}`);

      setTotal((prev) => prev - 1);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id),
      );
      dispatch(
        addToast({
          title: "Product deleted",
          type: "success",
          message: "The product was deleted successfully.",
        }),
      );
    } catch (err) {
      const errorMsg = axiosErrorHandler(err) || "something wrong happened";
      dispatch(
        addToast({
          title: "Unable to delete product",
          type: "danger",
          message: errorMsg,
        }),
      );
    }
  }

  return (
    <div className="p-2 w-100 mx-2">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Products</h2>

        <Link
          className="btn btn-primary fw-bold d-flex align-items-center gap-2 shadow-lg "
          to={"/dashboard/product/create"}
        >
          <FontAwesomeIcon className="shadow-lg" icon={faPlus} />
          Create product
        </Link>
      </div>

      {products.length === 0 && !checkItems ? (
        <LoadingPage

          mt="130px"
          mh={"60vh"}
        />
      ) : products.length === 0 && checkItems ? (
        <span className="error-noitems">no products found</span>
      ) : (
        <Table
          header={table_columns["products"]}
          data={products}
          delUser={deleteUser}
          limit={myLimit}
          page={myCurrentPage}
          setMyCurrentPage={setMyCurrentPage}
          setLimit={setMyLimit}
          loading={prodLoading}
          total={total}
          searchLink={PROD}
          foundType="products"
        />
      )}
    </div>
  );
};

export default Products;
