// rrd
import { Route, Routes, useLocation } from "react-router-dom";
// pages
import HomePage from "../features/product/sections/HomePage.jsx";
import Login from "../features/auth/LoginPage.jsx";
import Register from "../features/auth/RegisterPage.jsx";
import GOOGLECALLBACK from "../features/auth/GoogleCallback.jsx";
import CheckAuth from "../features/auth/CheckAuth.jsx";
import Error404 from "../components/feedback/Error404.jsx";
import AuthBack from "../features/auth/AuthBack.jsx";
// dashboard
import Dashboard from "../features/dashboard/DashboardLayout.jsx";
import Users from "../features/dashboard/users/UsersPage.jsx";
import EditUser from "../features/dashboard/users/EditUserPage.jsx";
import CreateUser from "../features/dashboard/users/CreateUserPage.jsx";
import Categories from "../features/dashboard/categories/CategoriesPage.jsx";
import EditCategory from "../features/dashboard/categories/EditCategoryPage.jsx";
import CreateCategory from "../features/dashboard/categories/CreateCategoryPage.jsx";
import Products from "../features/dashboard/products/ProductsPage.jsx";
import CreateProduct from "../features/dashboard/products/CreateProductPage.jsx";
import EditProduct from "../features/dashboard/products/EditProductPage.jsx";
import CategoriesPage from "../features/product/sections/CategoriesPage.jsx";
import Website from "../features/storefront/StorefrontLayout.jsx";
import SingleProduct from "../features/product/SingleProductPage.jsx";
import CartPage from "../features/cart/CartPage.jsx";
import CartModalRoute from "./CartModalRoute";

const AppRouter = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<Website />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<SingleProduct  />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
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
      {backgroundLocation && (
        <Routes>
          <Route path="/cart" element={<CartModalRoute />} />
        </Routes>
      )}
    </>
  )
}

export default AppRouter
