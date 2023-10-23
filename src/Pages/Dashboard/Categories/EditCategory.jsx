/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
// import { REGISTERREQ, baseURL } from "../../Api/api";
import LoadingPage from "../../loading";
// rrd
import { useNavigate, useParams } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";

import { AX } from "../../../Api/AxiosShortCut";
import { ONECAT } from "../../../Api/api";

const EditCategory = () => {
  const nav = useNavigate();

  
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
  });

  let {id} = useParams();

  
      const cat = useRef();



  useEffect(()=>{
    cat.current.focus()
  },[])


  

  useEffect(() => {
    setLoading(true);
    const res = AX.get(`${ONECAT}/${id}`)
      .then((res) => {
        setFormData({
          title: res.data.title,
        });
        setLoading(false);
      })
      .catch((err) => nav("/dashboard/categories/page/404", { replace: true }));
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setFormStatus(true);
    setLoading(true);
    const formAppended = new FormData()

    formAppended.append("title",formData.title)
    formAppended.append("image",formData.image)

    try {
      const response = await AX.post(`/${ONECAT}/edit/${id}`, formAppended);
      setLoading(false);
      await new Promise((res) => setTimeout(res, 200));
      
      nav("/dashboard/categories");
    } catch (error) {
      if (error.response.status === 500) {
        await new Promise((res) => setTimeout(res, Math.random() * 900));
        setLoading(false);
      }
    }
  };

  const detectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };



  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#fff" />}

      <Form className="w-100 bg-white p-3" onSubmit={submitForm}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            onChange={detectChange}
            value={formData.title}
            placeholder="title..."
            ref={cat}
          />
          {formData.title.trim().length < 3 && formStatus && (
            <p className="error">title should be 3 characters at least</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label>image</Form.Label>
          <Form.Control
            onChange={(e) =>
              setFormData({
                ...formData,
                [e.target.name]: e.target.files.item(0),
              })
            }
            type="file"
            accept="image/*"
            name="image"
          />
          
        </Form.Group>

        <button
          disabled={
            formData.title === "" || formData.image === "" ? true : false
          }
          className="btn btn-primary"
        >
          save
        </button>
      </Form>
    </>
  );
};

export default EditCategory;
