import { Form } from 'react-bootstrap'
import Button from '../../../components/ui/Button/Button'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const SearchBar = ({query,setQuery}) => {
    const navigate=useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams, "searchParams");
  return (
    <>
       <Form.Control
                    type="search"
                    className="form-control custom-search py-3 b-10"
                    placeholder="search product"
                    value={query ||  searchParams.get("q") || ""}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                        navigate(`/products?q=${encodeURIComponent(query.trim())}`)
                    }}
                   className="btn btn-primary position-absolute top-0 end-0 h-100 line-height m-0 px-4 d-flex align-items-center justify-content-center b-10"
                   >
                    Search
                  </Button>
    </>
  )
}

export default SearchBar
