import { useEffect, useRef, useState } from "react";
import { REGISTERREQ, baseURL } from "../../api/endpoints.js";
import LoadingPage from "../../components/feedback/LoadingPage.jsx";
// rrd
import { Link, useNavigate } from "react-router-dom";
//  libraries
import Cookie from "cookie-universal";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/ui/Button/Button.jsx";
// imgs
import GOOGLEICON from "../../assets/google-icon.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCartAfterPlaceOrder } from "../../store/cart/cartSlice";
import {
  createCartMergeIdempotencyKey,
  useMergeCartMutation,
} from "../../hooks/cart/useMergeCart.js";
import { getGuestCartItems } from "../../utils/guestCart";
import { registerSchema } from "../../validations/registerSchema";
import AuthInput from "../../components/forms/AuthInput";
import { addToast } from "../../store/toasts/toastSlice";

const Register = () => {
  const cookie = Cookie();
  const dispatch = useAppDispatch();
  const guestCartItems = useAppSelector((state) => state.cart.items);
  const mergeCartMutation = useMergeCartMutation();
  const nav = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const nameRef = useRef(null);

  useEffect(() => {
    if(nameRef.current) nameRef.current.focus();
  }, []);

  const submitForm = async (formData) => {
    setLoading(true);
    setEmailError("");

    try {
      const response = await axios.post(`${baseURL}/${REGISTERREQ}`, formData);
      const token = response.data.token;
      cookie.set("user-token", token);

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

      dispatch(
        addToast({
          title: "Registration complete",
          type: "success",
          message: "Your account was created. You can now sign in.",
        }),
      );
      nav("/login");
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const message =
        error.response?.data?.error ||
        (validationErrors &&
          Object.values(validationErrors).flat().join(" ")) ||
        error.response?.data?.message ||
        "Unable to complete registration";

      setEmailError(message);
      dispatch(
        addToast({
          title: "Registration failed",
          type: "danger",
          message,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#9aa0a74d" />}
      <div className="container">
        <div className="s-row my-h-100">
          <form onSubmit={handleSubmit(submitForm)} className="form">
            <h2>Register now</h2>
            <AuthInput
              name="name"
              label="name"
              placeholder="Enter Name"
              register={register}
              error={errors.name?.message}
              isSubmitted={isSubmitted}
              ref={nameRef}
            />
            <AuthInput
              name="email"
              label="email"
              type="email"
              placeholder="Enter Email"
              register={register}
              error={errors.email?.message}
              isSubmitted={isSubmitted}
            />
            <AuthInput
              name="password"
              label="password"
              type="password"
              placeholder="Enter Password"
              register={register}
              error={errors.password?.message}
              isSubmitted={isSubmitted}
            />
            <Button type="submit" loading={loading} loadingText="register">
              register
            </Button>
            <div className="google-btn">
              <a href={`http://127.0.0.1:8000/login-google`}>
                <div className="google-icon-holder">
                  <img src={GOOGLEICON} alt="" />
                </div>
                <p className="btn-text">
                  <b>Register in with google</b>
                </p>
              </a>
            </div>
            <div className="noaccount_createOne">
              <div className="gocreateone">have an account?{"   "}<Link className="creating" to="/login"> sign in</Link></div>
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

export default Register;
