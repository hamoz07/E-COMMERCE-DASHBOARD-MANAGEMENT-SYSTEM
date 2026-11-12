import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate import
// api
import { LGOINREQ, baseURL, roleRoutes } from "../../api/endpoints.js";
// loading
import LoadingPage from "../../components/feedback/LoadingPage.jsx";
// libraries
import Cookie from "cookie-universal";  
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../components/ui/Button/Button.jsx";
// imgs
import GOOGLEICON from "../../assets/google-icon.png";
import axiosErrorHandler from "../../utils/axiosErrorHandler";
import { loginSchema } from "../../validations/loginSchema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCartAfterPlaceOrder } from "../../store/cart/cartSlice";
import {
  createCartMergeIdempotencyKey,
  useMergeCartMutation,
} from "../../hooks/cart/useMergeCart.js";
import { getGuestCartItems } from "../../utils/guestCart";
import AuthInput from "../../components/forms/AuthInput";
import { addToast } from "../../store/toasts/toastSlice";


const Login = () => {
  const cookie = Cookie();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const guestCartItems = useAppSelector((state) => state.cart.items);
  const mergeCartMutation = useMergeCartMutation();
  const queryClient = useQueryClient();
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm({
    resolver: zodResolver(loginSchema), 
    mode: "onBlur",
    defaultValues: { email: "", password: "" }
  });

  const emailRef = useRef(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const submitForm = async (formData) => {
    setLoading(true);
    setEmailError("");

    try {
      const response = await axios.post(`${baseURL}/${LGOINREQ}`, formData, {
        signal: AbortSignal.timeout(5000)  
      });
      
      const data = response.data;
      cookie.set("user-token", data.token);

      if (Object.keys(guestCartItems).length > 0) {
        try {
          await mergeCartMutation.mutateAsync({
            items: getGuestCartItems(guestCartItems),
            idempotencyKey: createCartMergeIdempotencyKey(),
          });
        } catch (mergeError) {
          cookie.remove("user-token");
          throw mergeError;
        }
        dispatch(clearCartAfterPlaceOrder());
      }
      queryClient.setQueryData(["authUser"], data.user);
      
      const destination = roleRoutes[data.user.role];

      if (!destination) {
        throw new Error("Unsupported user role");
      }

      dispatch(
        addToast({
          title: "Welcome back",
          type: "success",
          message: "You have been signed in successfully.",
        }),
      );
      navigate(destination, { replace: true });
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      setEmailError(errorMsg || "Wrong Email or password");
      dispatch(
        addToast({
          title: "Login failed",
          type: "danger",
          message: errorMsg || "Wrong email or password.",
        }),
      );
    } finally {
      setLoading(false); // ✅ Safely unlocks loader on completion or error
    }
  };

  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#9aa0a74d" />}
      <div className="container">
        <div className="s-row my-h-100">
          <form onSubmit={handleSubmit(submitForm)} className="form">
            <h2>Login</h2>

            <AuthInput
              name="email"
              label="email"
              type="email"
              placeholder="Enter Email"
              register={register}
              error={errors.email?.message}
              isSubmitted={isSubmitted}
              ref={emailRef}
            />
            <AuthInput
              name="password"
              label="password"
              type="password"
              placeholder="Enter password"
              register={register}
              error={errors.password?.message}
              isSubmitted={isSubmitted}
            />

            <Button type="submit" loading={loading} loadingText="login">
              login
            </Button>

            <div className="google-btn">
              <a href={`http://127.0.0.1:8000/login-google`}>
                <div className="google-icon-holder">
                  <img src={GOOGLEICON} alt="" />
                </div>
                <p className="btn-text">
                  <b>Sign in with google</b>
                </p>
              </a>
            </div>
            
            <div className="noaccount_createOne">
              <div className="gocreateone">
                {"don't"} have an account? <Link className="creating" to="/register">create one </Link>
              </div>
            </div>
            
            <div className="input-desc">
              {emailError !== "" && <span className="error">{emailError}</span>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
