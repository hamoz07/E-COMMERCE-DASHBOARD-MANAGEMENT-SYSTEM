import { useEffect, useRef, useState } from "react";
import LoadingPage from "../../loading";
// rrd
import { useNavigate } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
import { AX } from "../../../Api/AxiosShortCut";
import { CATADD } from "../../../Api/api";

const CreateCategory = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
  });

  const cat = useRef();

  useEffect(() => {
    cat.current.focus();
  }, []);



  const submitForm = async (e) => {
    e.preventDefault();
    setFormStatus(true);
    setLoading(true);
    const formAppended = new FormData();

    formAppended.append("title", formData.title);
    formAppended.append("image", formData.image);

    try {
      await AX.post(`/${CATADD}`, formAppended);
      setLoading(false);
      await new Promise((res) => setTimeout(res, 200));
      nav("/dashboard/categories");
    } catch (error) {
      if (error.response.status === 422) {
        await new Promise((res) => setTimeout(res, Math.random() * 900));
        setLoading(false);
        console.log(error);
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
          <Form.Label>title</Form.Label>
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
            accept="image/*"
            type="file"
            name="image"
          />
        </Form.Group>

        <button
          disabled={
            formData.title.length < 3 || formData.image === "" ? true : false
          }
          className="btn btn-primary"
        >
          create category
        </button>
      </Form>
    </>
  );
};

export default CreateCategory;
