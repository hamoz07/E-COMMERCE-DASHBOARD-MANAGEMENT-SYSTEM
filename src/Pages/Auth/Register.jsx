import { useEffect, useRef, useState } from "react";
import { REGISTERREQ, baseURL } from "../../Api/api";
import LoadingPage from "../loading";
// rrd
import { Link, useNavigate } from "react-router-dom";
//  libraries
import Cookie from "cookie-universal";
import axios from "axios";
// imgs
import GOOGLEICON from "../../assets/google-icon.png";

const Register = () => {
  const cookie = Cookie();

  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const nameRef = useRef();


  useEffect(()=>{
    nameRef.current.focus()
  },[])

  const submitForm = async (e) => {
    e.preventDefault();
    setFormStatus(true);
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/${REGISTERREQ}`, formData);
      setLoading(false);
      await new Promise((res) => setTimeout(res, 1000));
      setEmailError("");
      await new Promise((res) => setTimeout(res, 500));
      const token = response.data.token;
      cookie.set("user-token", token);
      location.pathname = ("/");
    } catch (error) {
      if (error.response.status === 422) {
        await new Promise((res) => setTimeout(res, Math.random() * 900));
        setEmailError("Email has already been taken");
        setLoading(false);
      } else {
        await new Promise((res) => setTimeout(res, Math.random() * 900));
        setLoading(false);
        setEmailError("Internal Server Error");
      }
    }
  };

  const detectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const isemailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.+[A-Z]{2,}$/i.test(
    formData.email.trim()
  );

  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#9aa0a74d" />}
      <div className="container">
        <div className="s-row my-h-100">
          <form onSubmit={submitForm} className="form">
            <h2>Register now</h2>
            <div className="input-desc my-mb-3">
              <input
                type="text"
                name="name"
                onChange={detectChange}
                value={formData.name}
                id="name"
                required
                placeholder="Enter Name"
                ref={nameRef}
              />
              <label htmlFor="name">name</label>
              {formData.name.trim().length < 3 && formStatus && (
                <p className="error">name should be 3 characters at least</p>
              )}
            </div>
            <div className="input-desc mb-3">
              <input
                type="email"
                name="email"
                onChange={detectChange}
                required={!isemailValid ? true : false}
                value={formData.email}
                id="email"
                placeholder="Enter Email"
              />
              <label htmlFor="email">email</label>
              {!isemailValid && formStatus && (
                <p className="error">please enter a valid email</p>
              )}
            </div>
            <div className="input-desc mb-3">
              <input
                type="password"
                name="password"
                onChange={detectChange}
                required
                minLength={8}
                value={formData.password}
                id="password"
                placeholder="Enter Password"
              />
              <label htmlFor="password">password</label>
              {formData.password.trim().length < 8 && formStatus && (
                <p className="error">password must be 8 characters or more</p>
              )}
            </div>
            <button type="submit">register</button>
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
              <div className="gocreateone">have an account?    <Link className="creating" to="/login"> sign in</Link></div>
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
