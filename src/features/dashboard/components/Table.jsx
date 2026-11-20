/* eslint-disable react/prop-types */
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Form, Table as BootstrapTable } from "react-bootstrap";
import PaginatedItems from "./pagination/pagination.jsx";
import { AX } from "../../../api/client.js";
import { atTypeGenerator } from "../../../utils/dategenerator.js";
import TableRow from "./TableRow.jsx";
import './TableLoadingState.css';
import { useDebounce } from "../../../hooks/useDebounce.js";
import { lookupKeys } from "./tableColumns.js";
import { TableLoadingRows } from "../../../components/skeletons/TableRowsSkeleton.jsx";
const LIMIT_OPTIONS = [3, 5, 10, 15];

const LimitSelect = ({ limit, setLimit,isLoading}) => (
  <Form.Select
    aria-label="Default select example"
    onChange={(e) => setLimit(e.target.value)}
    value={limit}
    style={{ marginTop:isLoading ? "90px" : "0px" }}
  >
    {LIMIT_OPTIONS.map((l) => (
      <option key={l} value={l}>
        {l}
      </option>
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
  error,
  searchLink,
  foundType,
}) => {
  const userState = currentUser || { name: "" };
  const [query, setQuery] = useState("");
  const [newData, setNewData] = useState([]);
  const [gettingFiltered, setGettingFiltered] = useState(false);
  const [nothingFound,setNothingFound] = useState(false);
  const [date, setDate] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);
  
  const newFilteredDateData = useMemo(
  () => data.filter((f) => atTypeGenerator(f.created_at) === date),
  [data, date]
);

const searchAndDateFiltered = useMemo(
  () => newData.filter((item) => atTypeGenerator(item.created_at) === date),
  [newData, date]
);

  const isSearching = query.trim().length > 0;
  const isSearchingOrFiltering = isSearching || date.length > 0;
  // const nothingFound = !gettingFiltered && isSearching && newData.length === 0;
const debouncedQuery = useDebounce(query.trim(), 600)
const checkWhichData = useMemo(() => {
  if (isSearching && date) return searchAndDateFiltered;
  if (date)               return newFilteredDateData;
  if (isSearching)        return newData;
  return data;
}, [isSearching, date, searchAndDateFiltered, newFilteredDateData, newData, data]);

  const headItems = header.map((item, i) => <th key={i}>{item.name}</th>);

const fetchWantedQuerysData = useCallback(
  async (searchTerm, signal) => {
    setGettingFiltered(true);
    try {
      const searchParams = new URLSearchParams();
      (lookupKeys[foundType] || []).forEach((field) => {
        searchParams.set(field, searchTerm);
      });

      const res = await AX.post(
        `/${searchLink}/search?${searchParams.toString()}`,
        null,
        { signal },
      );
      setNewData(res.data);
      setNothingFound(res.data.length === 0);
    } catch (err) {
      if (err.name !== "CanceledError") console.error(err);
    } finally {
      setGettingFiltered(false);
    }
  },
  [foundType, searchLink]
);

// ✅ Create and clean up the controller in the effect
useEffect(() => {
  if (!debouncedQuery) {
    setNothingFound(false);
    setGettingFiltered(false);
    setNewData([]);
    return;
  }
 
  const controller = new AbortController();
  fetchWantedQuerysData(debouncedQuery, controller.signal);

  return () => controller.abort(); // cancels the in-flight request
}, [debouncedQuery, fetchWantedQuerysData]);

  useEffect(() => {
    if (loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  const handleDeleteClick = useCallback(
    async (id) => {
      setDeletingIds((prev) => [...prev, id]);

      try {
        await delUser(id);
      } catch (err) {
        setDeletingIds((prev) => prev.filter((item) => item !== id));
      }
    },
    [delUser],
  );

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
          placeholder={`search ${foundType} by ${lookupKeys[foundType].join(", ")}`}
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
      <BootstrapTable
        striped
        hover
        className="overflow-hidden rounded-3 mt-1"
        aria-busy={loading || gettingFiltered}
      >
        <thead className="table-theme-header">
          <tr>
            <th>id</th>
            {headItems}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableLoadingRows
              columnCount={header.length + 2}
              rowCount={limit}
            />
          ) : error ? (
            <tr>
              <td colSpan={header.length + 2}>
                <span className="text-danger">{error}</span>
              </td>
            </tr>
          ) : gettingFiltered ? (
            <tr>
           <td
  colSpan={header.length + 2}
  className="table-loading-cell"
>
  <div
    className="table-loading-content"
    role="status"
    aria-live="polite"
    aria-label="Loading results"
  >
    <div className="table-loading-spinner" />
    <span>Loading...</span>
  </div>
</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={header.length + 2}>
                <span className="error-noitems">no {foundType} found</span>
              </td>
            </tr>
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
      {!loading &&
        !gettingFiltered &&
        !nothingFound &&
        !isSearchingOrFiltering && (
          <>
            {data.length >= 3 && (
              <LimitSelect
                limit={limit}
                setLimit={setLimit}
                isLoading={loading || gettingFiltered}
              />
            )}
            <PaginatedItems
              setMyCurrentPage={setMyCurrentPage}
              pageCount={Math.ceil(total / limit)}
            />
          </>
        )}
    </Fragment>
  );
};

export default Table;
