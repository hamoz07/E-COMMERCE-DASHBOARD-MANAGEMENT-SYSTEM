import { useEffect, useRef, useState } from "react";
// rrd
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// api
import { LGOINREQ, ONEUSERREQ, baseURL } from "../../Api/api";
// loading
import LoadingPage from "../loading";

// cookie library
import Cookie from "cookie-universal";

// imgs
import GOOGLEICON from "../../assets/google-icon.png";
import { AX } from "../../Api/AxiosShortCut";

const Login = () => {
  const nav = useNavigate();
  const cookie = Cookie();
  const [formStatus, setFormStatus] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef();


  useEffect(()=>{
    emailRef.current.focus()
  },[])
  
  
  
  const isemailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
    formData.email.trim()
  );

    



  const submitForm = async (e) => {
    setFormStatus(true);
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/${LGOINREQ}`, formData);
      setLoading(false);
      await new Promise((res) => setTimeout(res, 500));
      setEmailError("");
      await new Promise((res) => setTimeout(res, 250));
      const token = response.data.token;
      cookie.set("user-token", token);
    
      if(response.data.user.role === "1995"){
        location.pathname = ("/dashboard/users");
      }else if(response.data.user.role === "1999"){        
        location.pathname = ("/dashboard/categories");
      }else{
        location.pathname = ("");
      }


    } catch (error) {
      if (error.response.status !== 422) {
        await new Promise((res) => setTimeout(res, Math.random() * 900));
        setEmailError("wrong Email or password");
        setLoading(false);
      }
    }
  };

  const detectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#9aa0a74d" />}
      <div className="container">
        <div className="s-row my-h-100">
          <form onSubmit={submitForm} className="form">
            <h2>Login</h2>
            <div className="input-desc my-mb-3">
              <input
                type="email"
                required={!isemailValid}
                name="email"
                onChange={detectChange}
                value={formData.email}
                id="email"
                placeholder="Enter Email"
                ref={emailRef}
              />
              {!isemailValid && formStatus && (
                <span className="error">please enter a valid email</span>
              )}
              <label htmlFor="email">email</label>
            </div>
            <div className="input-desc mb-3">
              <input
                type="password"
                required
                name="password"
                onChange={detectChange}
                minLength={8}
                value={formData.password}
                id="password"
                placeholder="enter password"
              />
              {formData.password.trim().length < 8 && formStatus && (
                <span className="error">password must be 8 characters or more</span>
              )}
              <label htmlFor="password">password</label>
            </div>
            <button type="submit">login</button>

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
              <div className="gocreateone">{"don't"} have an account?  <Link className="creating" to="/register">create one </Link></div>
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
