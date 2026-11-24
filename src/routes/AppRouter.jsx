import { lazy, Suspense } from "react";
import { lazyWithMinDelay } from "../utils/lazyWithMinDelay";
import { Route, Routes, useLocation } from "react-router-dom";

// ==========================================
// EAGER IMPORTS (Critical for Initial Load & Layouts)
// ==========================================
import HomePage from "../features/product/sections/HomePage.jsx";
import Website from "../features/storefront/StorefrontLayout.jsx";
import AuthBack from "../features/auth/AuthBack.jsx";
import CheckAuth from "../features/auth/CheckAuth.jsx";
import RequireRole from "../features/auth/RequireRole.jsx";
import Dashboard from "../layout/DashboardLayout/DashboardLayout.jsx";

// Feedback / Fallback Component
import PageLoader from "../components/feedback/PageLoader.jsx"; 
// ==========================================
// LAZY-LOADED IMPORTS (Code-Splitting)
// ==========================================
// Auth & Public Pages
const Login = lazyWithMinDelay(() => import("../features/auth/LoginPage.jsx"));
const Register = lazyWithMinDelay(() => import("../features/auth/RegisterPage.jsx"));
const GoogleCallback = lazyWithMinDelay(() => import("../features/auth/GoogleCallback.jsx"));
const CategoriesPage = lazyWithMinDelay(() => import("../features/product/sections/CategoriesPage.jsx"));
const ProductsPage = lazyWithMinDelay(() => import("../features/product/sections/ProductsPage.jsx"));
const SingleProduct = lazyWithMinDelay(() => import("../features/product/SingleProductPage.jsx"));
const CartPage = lazyWithMinDelay(() => import("../features/cart/CartPage.jsx"));
const CartModalRoute = lazyWithMinDelay(() => import("./CartModalRoute.jsx"));
const Error404 = lazyWithMinDelay(() => import("../components/feedback/Error404.jsx"));

// Dashboard Pages (Heavy administrative modules)
const DashboardHome = lazyWithMinDelay(() => import("../features/dashboard/DashboardHome.jsx"));
const Users = lazyWithMinDelay(() => import("../features/dashboard/users/UsersPage.jsx"));
const EditUser = lazyWithMinDelay(() => import("../features/dashboard/users/EditUserPage.jsx"));
const CreateUser = lazyWithMinDelay(() => import("../features/dashboard/users/CreateUserPage.jsx"));
const Categories = lazyWithMinDelay(() => import("../features/dashboard/categories/CategoriesPage.jsx"));
const EditCategory = lazyWithMinDelay(() => import("../features/dashboard/categories/EditCategoryPage.jsx"));
const CreateCategory = lazyWithMinDelay(() => import("../features/dashboard/categories/CreateCategoryPage.jsx"));
const Products = lazyWithMinDelay(() => import("../features/dashboard/products/ProductsPage.jsx"));
const CreateProduct = lazyWithMinDelay(() => import("../features/dashboard/products/CreateProductPage.jsx"));
const EditProduct = lazyWithMinDelay(() => import("../features/dashboard/products/EditProductPage.jsx"));

const AppRouter = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.openCartModal
    ? location.state.backgroundLocation
    : null;

  return (
    <>
    <Routes location={backgroundLocation || location}>
      {/* ================= WEBSITE FRONTEND ================= */}
      <Route element={<Website />}>
        {/* HomePage is eager-loaded for instant FCP/LCP performance */}
        <Route path="/" element={<HomePage />} />
        
        <Route 
          path="/categories" 
          element={
            <Suspense fallback={<PageLoader />}>
              <CategoriesPage />
            </Suspense>
          } 
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductsPage />
            </Suspense>
          }
        />
        <Route 
          path="/product/:id" 
          element={
            <Suspense fallback={<PageLoader />}>
              <SingleProduct />
            </Suspense>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <Suspense fallback={<PageLoader />}>
              <CartPage />
            </Suspense>
          } 
        />
      </Route>

      {/* ================= AUTHENTICATION ================= */}
      <Route element={<AuthBack />}>
        <Route 
          path="/login" 
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          } 
        />
        <Route 
          path="/register" 
          element={
            <Suspense fallback={<PageLoader />}>
              <Register />
            </Suspense>
          } 
        />
      </Route>
      
      <Route 
        path="/auth/google/callback" 
        element={
          <Suspense fallback={<PageLoader />}>
            <GoogleCallback />
          </Suspense>
        } 
      />

      {/* ================= ADMIN DASHBOARD ================= */}
      <Route element={<CheckAuth />}>
        <Route element={<RequireRole roles={["1996", "1995", "1999"]} />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          >
            <Route
              index
              element={
                <Suspense fallback={<PageLoader text={"Loading Dashboard"} />}>
                  <DashboardHome />
                </Suspense>
              }
            />

            {/* User Management Sub-routes */}
            <Route element={<RequireRole roles={["1995"]} />}>
              <Route path="users" element={<Suspense fallback={<PageLoader text={"Loading users..."} />}><Users /></Suspense>} />
              <Route path="users/:id" element={<Suspense fallback={<PageLoader text={"Loading user..."} />}><EditUser /></Suspense>} />
              <Route path="user/create" element={<Suspense fallback={<PageLoader text={"Loading user creation..."} />}><CreateUser /></Suspense>} />
            </Route>

            {/* Catalog & Product Management Sub-routes */}
            <Route element={<RequireRole roles={["1999", "1995"]} />}>
              <Route path="categories" element={<Suspense fallback={<PageLoader text={"Loading categories..."} />}><Categories /></Suspense>} />
              <Route path="category/create" element={<Suspense fallback={<PageLoader text={"Loading category creation..."} />}><CreateCategory /></Suspense>} />
              <Route path="categories/:id" element={<Suspense fallback={<PageLoader text={"Loading category..."} />}><EditCategory /></Suspense>} />
              <Route path="products" element={<Suspense fallback={<PageLoader text={"Loading products..."} />}><Products /></Suspense>} />
              <Route path="product/create" element={<Suspense fallback={<PageLoader text={"Loading product creation..."} />}><CreateProduct /></Suspense>} />
              <Route path="products/:id" element={<Suspense fallback={<PageLoader text={"Loading product..."} />}><EditProduct /></Suspense>} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* ================= 404 NOT FOUND ================= */}
      <Route 
        path="*" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Error404 />
          </Suspense>
        } 
      />

      {/* ================= INTERCEPTED MODAL ROUTE ================= */}
    </Routes>
      {backgroundLocation && (
        <Routes location={location}>
          <Route 
            path="/cart" 
            element={
              <Suspense fallback={null}>
                <CartModalRoute />
              </Suspense>
            } 
          />
        </Routes>
      )}
      </>
  );
};

export default AppRouter;