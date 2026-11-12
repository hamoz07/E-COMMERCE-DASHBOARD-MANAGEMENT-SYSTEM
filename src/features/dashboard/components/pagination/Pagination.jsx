
import ReactPaginate from 'react-paginate';
import './pagination.css';


export default function PaginatedItems({ pageCount,setMyCurrentPage}) {
  
  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">>"
        onPageChange={(e) => {setMyCurrentPage(e.selected + 1)}}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<<"
        renderOnZeroPageCount={null}
        containerClassName="Pagination__holder "
        pageClassName="Pagination__holder_li"
        activeClassName="Pagination__holder_li--active"
        
      />
    </>
  );
}

