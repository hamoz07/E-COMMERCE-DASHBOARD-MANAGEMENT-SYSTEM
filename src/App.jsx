// rrd
import { Route, Routes } from "react-router-dom";
// pages
import HomePage from "./Pages/Website/HomePage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import GOOGLECALLBACK from "./Pages/Auth/GOOGLE-CALL-BACK";
import CheckAuth from "./Pages/Auth/CheckAuth";
import Error404 from "./Pages/Error404";
import AuthBack from "./Pages/Auth/AuthBack";
// dashboard
import Dashboard from "./Pages/Dashboard/Dashboard";
import Users from "./Pages/Dashboard/User/Users";
import EditUser from "./Pages/Dashboard/User/EditUser";
import CreateUser from "./Pages/Dashboard/User/CreateUser";
import Categories from "./Pages/Dashboard/Categories/Categories";
import EditCategory from "./Pages/Dashboard/Categories/EditCategory";
import CreateCategory from "./Pages/Dashboard/Categories/CreateCategory";
import Products from "./Pages/Dashboard/Products/Products";
import CreateProduct from "./Pages/Dashboard/Products/CreateProduct";
import EditProduct from "./Pages/Dashboard/Products/EditProduct";


function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<AuthBack />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path={`/auth/google/callback`} element={<GOOGLECALLBACK />} />
        <Route path={`/*`} element={<Error404 />} />
        <Route element={<CheckAuth role={["1996", "1995","1999"]} />}>
          <Route path={`/dashboard`} element={<Dashboard />}>
            <Route element={<CheckAuth role={["1995"]} />}>
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<EditUser />} />
              <Route path="user/create" element={<CreateUser />} />
            </Route>
            <Route element={<CheckAuth role={["1999", "1995"]} />}>
              <Route path="categories" element={<Categories />} />
              <Route path="category/create" element={<CreateCategory />} />
              <Route path="categories/:id" element={<EditCategory />} />
              <Route path="products" element={<Products />} />
              <Route path="product/create" element={<CreateProduct />} />
              <Route path="products/:id" element={<EditProduct />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
