/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
// import { REGISTERREQ, baseURL } from "../../Api/api";
import LoadingPage from "../../loading";
// rrd
import { useNavigate, useParams } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
import { AX } from "../../../Api/AxiosShortCut";
import { ONEUSERREQ, } from "../../../Api/api";

const EditUser = () => {
  
  const nav = useNavigate();

  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  let {id} = useParams();

  const nameRef = useRef();


  useEffect(()=>{
    nameRef.current.focus()
  },[])
  

  useEffect(() => {
    setLoading(true)
    const res = AX.get(`${ONEUSERREQ}/${id}`).then((res) => {
      setFormData({
        email: res.data.email,
        name: res.data.name,
        role: res.data.role,
      });
    setLoading(false)
    }).catch(err => nav("/dashboard/users/page/404",{replace:true}))
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setFormStatus(true);
    setLoading(true);

    try {
      const response = await AX.post(`/${ONEUSERREQ}/edit/${id}`, formData);
      setLoading(false);
      await new Promise((res) => setTimeout(res, 200));
      setEmailError("");
      await new Promise((res) => setTimeout(res, 200));
      nav("/dashboard/users");
    } catch (error) {
      if (error.response.status === 500) {
        await new Promise((res) => setTimeout(res, Math.random() * 900));
        setEmailError("Email has already been taken");
        setLoading(false);
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
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#fff" />}

      <Form className="w-100 bg-white p-3" onSubmit={submitForm}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            onChange={detectChange}
            value={formData.name}
            placeholder="name..."
            ref={nameRef}
          />
          {formData.name.trim().length < 3 && formStatus && (
            <p className="error">name should be 3 characters at least</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            onChange={detectChange}
            required={!isemailValid ? true : false}
            value={formData.email}
            type="email"
            name="email"
            placeholder="Email..."
          />
          {!isemailValid && formStatus && (
            <p className="error">please enter a valid email</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            onChange={detectChange}
            name="role"
            value={formData.role}
          >
            <option disabled value={""}>
              select role
            </option>
            <option value={"2001"}>user</option>
            <option value={"1995"}>admin</option>
            <option value={"1999"}>Product Manager</option>
          </Form.Select>
        </Form.Group>
        <button
          disabled={
            formData.name === "" || formData.email === "" ? true : false
          }
          className="btn btn-primary"
        >
          save
        </button>
        <div className="input-desc">
          {emailError !== "" && <span className="error">{emailError}</span>}
        </div>
      </Form>
    </>
  );
};

export default EditUser;
