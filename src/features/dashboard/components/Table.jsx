/* eslint-disable react/prop-types */
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Table as BootstrapTable } from "react-bootstrap";
import { Link } from "react-router-dom";
import PaginatedItems from "./pagination/pagination.jsx";
import LoadingPage from "../../../components/feedback/LoadingPage.jsx";
import { AX } from "../../../api/client.js";
import { atTypeGenerator } from "../../../utils/dategenerator.js";
import TableRow from "./TableRow.jsx";

const  LIMIT_OPTIONS = [3,5,10,15]

const LimitSelect = ({ limit, setLimit, loading, gettingFiltered }) => (
  <Form.Select
    aria-label="Default select example"
    onChange={(e) => setLimit(e.target.value)}
    value={limit}
    style={{ marginTop: gettingFiltered || loading ? "90px" : "0px" }}
  >
    {LIMIT_OPTIONS.map((l) => (
      <option key={l} value={l}>{l}</option>
    ))}
  </Form.Select>
);

const Table = ({
  header,
  data,
  currentUser,
  delUser,
  limit,
  setLimit,
  total,
  setMyCurrentPage,
  loading,
  searchLink,
  foundType,
}) => {
  const userState = currentUser || { name: "" };
  const [query, setQuery] = useState("");
  const [newData, setNewData] = useState([]);
  const [nothingFound, setNothingFound] = useState(false);
  const [gettingFiltered, setGettingFiltered] = useState(false);
  const [date, setDate] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);

  const newFilteredDateData = data.filter(
    (f) => atTypeGenerator(f.created_at) === date
  );
  const searchAndDateFiltered = newData.filter(
    (item) => atTypeGenerator(item.created_at) === date
  );

  const isSearching = query.trim().length > 0;
  const isSearchingOrFiltering = isSearching || date.length > 0;

  const checkWhichData = date.length !== 0
    ? isSearching ? searchAndDateFiltered : newFilteredDateData
    : isSearching ? newData : data;

  const headItems = header.map((item, i) => <th key={i}>{item.name}</th>);

  const fetchWantedQuerysData = useCallback(async (searchTerm) => {
    setGettingFiltered(true);
    try {
      const res = await AX.post(`/${searchLink}/search?title=${searchTerm}`);
      setNothingFound(res.data.length === 0);
      setNewData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setGettingFiltered(false);
    }
  }, [searchLink]);

  // Clean Debounce Effect
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      setNothingFound(false);
      setNewData([]);
      setGettingFiltered(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchWantedQuerysData(trimmedQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [query, fetchWantedQuerysData]);

  useEffect(() => {
    if (loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

   const handleDeleteClick = useCallback(async (id) => {
  setDeletingIds((prev) => [...prev, id]);

  try {
    await delUser(id);
  } catch (err) {
    setDeletingIds((prev) =>
      prev.filter((item) => item !== id)
    );
  }
}, [delUser]);

  const datamapped = checkWhichData.map((item) => (
  <TableRow
    key={item.id}
    item={item}
    header={header}
    userName={userState.name}
    isThisRowDeleting={deletingIds.includes(item.id)}
    onDelete={handleDeleteClick}
  />
));

  return (
    <Fragment>
      <div className="d-flex gap-1">
        <Form.Control
          type="search"
          placeholder="search"
          className="my-2 search_bar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Form.Control
          type="date"
          placeholder="pick a date"
          className="my-2 search_bar"
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <BootstrapTable striped hover className="overflow-hidden rounded-3 mt-1">
        <thead className="table-dark">
          <tr>
            <th>id</th>
            {headItems}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading || gettingFiltered ? (
            <LoadingPage
              bg={"transparent"}
              mt="224px"
              mh={"11vh"}
              inTable={true}
            />
          ) : nothingFound ? (
            <tr>
              <td colSpan={header.length + 2}>
                <span className="error-noitems">no {foundType} found</span>
              </td>
            </tr>
          ) : (
            datamapped
          )}
        </tbody>
      </BootstrapTable>
      {!loading && !gettingFiltered && !nothingFound && !isSearchingOrFiltering && (
        <>
          {data.length >= 3 && (
            <LimitSelect
              limit={limit}
              setLimit={setLimit}
              loading={loading}
              gettingFiltered={gettingFiltered}
            />
          )}
          <PaginatedItems
            setMyCurrentPage={setMyCurrentPage}
            pageCount={Math.ceil(total / limit) }
          />
        </>
      )}
    </Fragment>
  );
};

export default Table;