import { useContext, useEffect, useState } from "react";

import {
  PROD,
  PRODUCTS,
} from "../../../api/endpoints.js";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { AX } from "../../../api/client.js";

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

  const [myLimit, setMyLimit] = useState(5);

  const [myCurrentPage, setMyCurrentPage] = useState(1);

  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState("");

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const runProds = async () => {
      setProdLoading(true);
      setProdError("");

      try {
        const res = await AX.get(
          `/${PRODUCTS}?limit=${myLimit}&page=${myCurrentPage}`,

          { signal: controller.signal },
        );

        setProducts(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to fetch products:", err);
          setProdError(axiosErrorHandler(err) || "Unable to load products.");
        }

      } finally {
        if (!controller.signal.aborted) {
          setProdLoading(false);
        }
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

      <Table
        header={table_columns["products"]}
        data={products}
        delUser={deleteUser}
        limit={myLimit}
        page={myCurrentPage}
        setMyCurrentPage={setMyCurrentPage}
        setLimit={setMyLimit}
        loading={prodLoading}
        error={prodError}
        total={total}
        searchLink={PROD}
        foundType="products"
      />
    </div>
  );
};

export default Products;
