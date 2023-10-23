/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
// import { REGISTERREQ, baseURL } from "../../Api/api";
import LoadingPage from "../../loading";
// rrd
import { useNavigate, useParams } from "react-router-dom";
//  libraries
import { Form } from "react-bootstrap";
// imgs
import uploadimg from "../../../assets/upload-1118929_960_720.png";
import { AX } from "../../../Api/AxiosShortCut";
import { CAT, ONECAT, PROD } from "../../../Api/api";

const EditProduct = () => {
  // refs and navs
  const nav = useNavigate();
  const showimg = useRef(null);
  const cat = useRef();

  
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
  });
  const [categories, setCategories] = useState([]);
  let { id } = useParams();


  // effects
  useEffect(() => {
    cat.current.focus();
  }, []);

  useEffect(() => {
    async function getProds(){
        setLoading(true);
        const res = await AX.get(`/${PROD}/${id}`)
      .then((res) => {
        setFormData({
          category: res.data[0].category,
          title: res.data[0].title,
          description: res.data[0].description,
          price: res.data[0].price,
          discount: res.data[0].discount,
          About: res.data[0].About,
        });
        // setImage(res.data[0].image);
        
        setLoading(false);
        
        
    })
      .catch((err) => nav("/dashboard/categories/page/404", { replace: true }));
    }

    getProds()
    
  }, []);

  useEffect(() => {
    async function getCats() {
      const res = await AX.get(`/${CAT}`).then((res) => {
        setCategories(res.data);
      });
      
    }
    getCats();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setFormStatus(true);
    setLoading(true);
    const prodsdata = new FormData();
    prodsdata.append("title", formData.title);
    prodsdata.append("description", formData.description);
    prodsdata.append("price", formData.price);
    prodsdata.append("discount", formData.discount);
    prodsdata.append("About", formData.About);
    prodsdata.append("category", formData.category);

    try {
      const response = await AX.post(`/${PROD}/edit/${id}`, prodsdata);
      setLoading(false);
      await new Promise((res) => setTimeout(res, 200));
      window.scrollTo(0, 0);
      nav("/dashboard/products");
    } catch (error) {
      if (error.response.status === 500) {
        await new Promise((res) => setTimeout(res, Math.random() * 900));
        setLoading(false);
      }
    }
  };

  const detectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


    const cats = categories.map((cat, i) => {
    return (
      <option key={i} value={cat.id}>
        {cat.title}
      </option>
    );
  });

  return (
    <>
      {loading && <LoadingPage mt="0" mh={"100vh"} bg="#fff" />}

      <Form className="w-100 bg-white p-3" onSubmit={submitForm}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>category</Form.Label>
          <Form.Select
            name="category"
            onChange={detectChange}
            value={formData.category}
            ref={cat}
          >
            <option defaultValue disabled value={""}>
              select a product category
            </option>
            {cats}
          </Form.Select>

        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            onChange={detectChange}
            value={formData.title}
            placeholder="title..."
            
          />
          {formData.title === "" && formStatus && (
            <p className="error">title should be 3 characters at least</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label>description</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.description}
            name="description"
            placeholder="description..."
             
          />
          {formData.description === "" && formStatus && (
            <p className="error">please describe the product</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label>price</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.price}
            name="price"
            placeholder="price..."
             
          />
          {isNaN(+formData.price) && formStatus && (
            <p className="error">please enter a number</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
          <Form.Label>discount</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.discount}
            name="discount"
            placeholder="discount..."
             
          />
          {isNaN(+formData.discount) && formStatus && (
            <p className="error">please enter a number</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
          <Form.Label>about</Form.Label>
          <Form.Control
            onChange={detectChange}
            type="text"
            value={formData.About}
            name="About"
            placeholder="about..."
             
          />
          {formData.About === "" && formStatus && (
            <p className="error">please tells us more about your product</p>
          )}
        </Form.Group>

        <button
          disabled={
            formData.title.length === "" ||
            formData.price === "" ||
            formData.discount === "" ||
            formData.About === "" ||
            formData.description === "" ||
            formData.category === ""
              ? true
              : false
          }
          className="btn btn-primary"
        >
          save
        </button>
      </Form>
    </>
  );
};

export default EditProduct;
