/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { CAT, CATADD, ONECAT, ONEUSERREQ } from "../../../api/endpoints.js";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AX } from "../../../api/client.js";
import { CONACT } from "../../../context/context.jsx";
import { WINContexter } from "../../../context/WindowContext";
import PaginatedItems from "../components/pagination/Pagination.jsx";
import { Form } from "react-bootstrap";
import { table_columns } from "../components/tableColumns.js";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import Table from "../components/Table.jsx";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/toasts/toastSlice";

const Categories = () => {
  const dispatch = useAppDispatch();
  const { open } = useContext(CONACT);
  const { windowStroke } = useContext(WINContexter);
  const [categories, setCategories] = useState([]);
  const [myLimit, setMyLimit] = useState(5);
  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [total, setTotal] = useState(0);


    useEffect(() => {
      const controller = new AbortController();
      const runProds = async () => {
        setCatLoading(true);
        setCatError("");
        try {
          const res = await AX.get(
            `/${CAT}?limit=${myLimit}&page=${myCurrentPage}`,
            { signal: controller.signal }
          );
  
          setCategories(res.data.data || []);
          setTotal(res.data.total || 0);
        } catch (err) {
          if (err.name !== "CanceledError" && err.name !== "AbortError") {
            console.error("Failed to fetch products:", err);
            setCatError(axiosErrorHandler(err) || "Unable to load categories.");
          }
        } finally {
          if (!controller.signal.aborted) {
            setCatLoading(false);
          }
        }
      };
  
      runProds();
  
      return () => controller.abort();
    }, [myLimit,myCurrentPage]);

  async function deleteCategory(id) {
    try {
      let res = await AX.delete(`/${ONECAT}/${id}`);
      setTotal(prev => prev - 1);
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id)); 
      dispatch(
        addToast({
          title: "Category deleted",
          type: "success",
          message: "The category was deleted successfully.",
        }),
      );
    } catch (err) {
      dispatch(
        addToast({
          title: "Unable to delete category",
          type: "danger",
          message: axiosErrorHandler(err) || "Please try again.",
        }),
      );
    }
  }


  return (
    
    <div className="p-2 w-100 mx-2">
      <div className="d-flex align-items-center justify-content-between mb-3">
      <h2 className="mb-0">Categories</h2>
        <Link
          className="btn btn-primary fw-bold d-flex align-items-center gap-2 shadow-lg "
          to={`/dashboard/${CAT}/create`}
        >
          <FontAwesomeIcon className="shadow-lg" icon={faPlus} />
          Create Category
        </Link>
      </div>
     
      <Table
        header={table_columns["categories"]}
        data={categories}
        delUser={deleteCategory}
        limit={myLimit}
        setMyCurrentPage={setMyCurrentPage}
        setLimit={setMyLimit}
        total={total}
        loading={catLoading}
        error={catError}
        searchLink={ONECAT}
        foundType="categories"
      />
    
    </div>
  );
};

export default Categories;
